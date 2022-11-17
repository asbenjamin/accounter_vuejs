<template>
    <div class="page-invoice">
        <nav class="breadcrumb" aria-label="breadcrumbs">
            <ul>
                <li><router-link to="/dashboard">Dashboard</router-link></li>
                <li><router-link to="/dashboard/receipts">Receipts</router-link></li>
                <li class="is-active"><router-link :to="{ name: 'Receipt', params: { id: receipt.id }}" aria-current="true">{{ receipt.receipt_number }}</router-link></li>
            </ul>
        </nav>

        <div class="columns is-multiline">
            <div class="column is-12">
                <h1 class="title">Receipt - {{ receipt.receipt_number }}</h1>

                <div class="buttons">
                    <button @click="getPdf()" class="button is-dark">Download PDF</button>

                    <template v-if="!receipt.is_credit_for && !receipt.is_credited">
                        <button @click="setAsPaid()" class="button is-success" v-if="!receipt.is_paid">Set as paid</button>
                        <button @click="createCreditNote()" class="button is-danger" v-if="!receipt.is_paid">Create credit note</button>
                    </template>

                    <button @click="sendReminder()" class="button is-info" v-if="!receipt.is_paid && !receipt.is_credit_for">Send reminder</button>
                </div>
            </div>

            <div class="column is-12 mb-4">
                <div class="box">
                    <h3 class="is-size-4 mb-5">Customer</h3>

                    <p><strong>{{ receipt.customer_name }}</strong></p>
                    
                    <p v-if="receipt.customer_address1">{{ receipt.customer_address1 }}</p>
                    <p v-if="receipt.customer_address2">{{ receipt.customer_address2 }}</p>
                    <p v-if="receipt.customer_zipcode || receipt.customer_place">{{ receipt.customer_zipcode }} {{ receipt.customer_place }}</p>
                    <p v-if="receipt.customer_country">{{ receipt.customer_country }}</p>
                </div>
            </div>

            <div class="column is-12 mb-4">
                <div class="box">
                    <h3 class="is-size-4 mb-5">Items</h3>

                    <table class="table is-fullwidth">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Quantity</th>
                                <th>Vat rate</th>
                                <th>Total</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr 
                                v-for="item in receipt.items"
                                v-bind:key="item.id"
                            >
                                <td>{{ item.title }}</td>
                                <td>{{ item.quantity }}</td>
                                <td>{{ item.vat_rate }}%</td>
                                <td>{{ getItemTotal(item) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="column is-12">
                <div class="box">
                    <h3 class="is-size-4 mb-5">Summary</h3>

                    <div class="columns">
                        <div class="column is-6">
                            <p><strong>Net amount</strong>: {{ receipt.net_amount }}</p>
                            <p><strong>Vat amount</strong>: {{ receipt.vat_amount }}</p>
                            <p><strong>Gross amount</strong>: {{ receipt.gross_amount }}</p>
                            <p><strong>Bank account</strong>: {{ receipt.bankaccount }}</p>
                        </div>
                    
                        <div class="column is-6">
                            <p><strong>Our reference</strong>: {{ receipt.sender_reference }}</p>
                            <p><strong>Customer reference</strong>: {{ receipt.customer_contact_reference }}</p>
                            <p><strong>Due date</strong>: {{ receipt.get_due_date_formatted }}</p>
                            <p><strong>Status</strong>: {{ getStatusLabel() }}</p>
                            <p><strong>Receipt type</strong>: {{ getReceiptType() }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { toast } from 'bulma-toast'

    const fileDownload = require('js-file-download')

    export default {
        name: 'Receipt',
        data() {
            return {
                receipt: {},
                items: []
            }
        },
        mounted() {
            this.getReceipt()
        },
        methods: {
            getReceipt() {
                const receiptID = this.$route.params.id

                axios
                    .get(`/api/v1/receipts/${receiptID}`)
                    .then(response => {
                        this.receipt = response.data
                    })
                    .catch(error => {
                        console.log(JSON.stringify(error))
                    })
            },
            getPdf() {
                const receiptID = this.$route.params.id

                axios
                    .get(`/api/v1/receipts/${receiptID}/generate_pdf/`, {
                        responseType: 'blob',
                    }).then(res => {
                        fileDownload(res.data, `receipt_${receiptID}.pdf`);
                    }).catch(err => {
                        console.log(err);
                    })
            },
            getStatusLabel() {
                if (this.receipt.is_paid) {
                    return 'Is paid'
                } else {
                    return 'Is not paid'
                }
            },
            getReceiptType() {
                if (this.receipt.receipt_type === 'credit_note') {
                    return 'Credit note'
                } else {
                    return 'Receipt'
                }
            },
            getItemTotal(item) {
                const unit_price = item.unit_price
                const quantity = item.quantity
                const total = item.net_amount + (item.net_amount * (item.vat_rate / 100))

                return parseFloat(total).toFixed(2)
            },
            async setAsPaid() {
                this.receipt.is_paid = true

                let items = this.receipt.items

                delete this.receipt['items']

                await axios
                    .patch(`/api/v1/receipts/${this.receipt.id}/`, this.receipt)
                    .then(response => {
                        toast({
                            message: 'The changes was saved',
                            type: 'is-success',
                            dismissible: true,
                            pauseOnHover: true,
                            duration: 2000,
                            position: 'bottom-right',
                        })
                    })
                    .catch(error => {
                        console.log(JSON.stringify(error))
                    })
                
                this.receipt.items = items
            },
            async createCreditNote() {
                this.receipt.is_credited = true

                let items = this.receipt.items

                delete this.receipt['items']

                await axios
                    .patch(`/api/v1/receipts/${this.receipt.id}/`, this.receipt)
                    .then(response => {
                        toast({
                            message: 'The changes was saved',
                            type: 'is-success',
                            dismissible: true,
                            pauseOnHover: true,
                            duration: 2000,
                            position: 'bottom-right',
                        })
                    })
                    .catch(error => {
                        console.log(JSON.stringify(error))
                    })
                
                this.receipt.items = items
                
                let creditNote = this.receipt
                creditNote.is_credit_for = this.receipt.id
                creditNote.is_credited = false
                creditNote.receipt_type = 'credit_note'

                delete creditNote['id']

                await axios
                    .post('api/v1/receipts/', creditNote)
                    .then(response => {
                        toast({
                            message: 'The credit note was created',
                            type: 'is-success',
                            dismissible: true,
                            pauseOnHover: true,
                            duration: 2000,
                            position: 'bottom-right',
                        })

                        this.$router.push('/dashboard/receipts')
                    })
                    .catch(error => {
                        console.log(JSON.stringify(error))
                    })
            },
            sendReminder() {
                axios
                    .get(`/api/v1/receipts/${this.receipt.id}/send_reminder/`)
                    .then(response => {
                        toast({
                            message: 'The reminder was sent',
                            type: 'is-success',
                            dismissible: true,
                            pauseOnHover: true,
                            duration: 2000,
                            position: 'bottom-right',
                        })
                    })
                    .catch(error => {
                        console.log(JSON.stringify(error))
                    })
            }
        }
    }
</script>
