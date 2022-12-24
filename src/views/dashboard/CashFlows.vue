<template>
    <div class="page-invoice">

            <div class="column is-12 mb-4">
                <div class="box">
                    <h3 class="is-size-4 mb-5">Income Statement</h3>

                    <table class="table is-fullwidth">
                        <thead>
                            <tr>
                                <th>Sales</th>
                                <th>Costs</th>
                                <th>Gross Profit</th>
                                <th>Sales Taxes</th>
                                <th>Net Profit</th>
                            </tr>
                        </thead>

                        <tbody>
                                <td>{{ sales.net_amount__sum }}</td>
                                <td>{{ costs.net_amount__sum }}</td>
                                <td>{{ gross_profit }}</td>
                                <td>{{ taxes }}</td>
                                <td>{{ net_profit }}</td>
                        </tbody>
                    </table>
                </div>
            </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { toast } from 'bulma-toast'

    export default {
        name: 'CashFlows',
        data() {
            return {
                sales: '',
                costs: '',
                gross_profit: '',
                taxes: '',
                net_profit: '',
                vat: '',
            }
        },
        mounted() {
            this.getSales()
            this.getCosts()
            this.getGrossProfit()
            this.getSalesTaxes()
            this.getNetProfit()
            this.getVAT()
        },
        methods: {
            // get month some way e.g. using a date/month/year picker and getting params to pass to the functions e.g.
            // const month = this.$route.params.month_num; 

            // find a way to include the month num in url e.g. v1/sales/?month=2 or v1/costs/?month=2

            getSales() {
                const month = this.$route.params.month_num; 

                axios
                    .get('/api/v1/sales')
                    .then(response => {
                        this.sales = response.data
                    })
                    .catch(error => {
                        console.log(JSON.stringify(error))
                    })
            },
            getCosts() {

                axios
                    .get('/api/v1/costs')
                    .then(response => {
                        this.costs = response.data
                    })
                    .catch(error => {
                        console.log(JSON.stringify(error))
                    })
            },
            getNetProfit() {

                axios
                    .get('/api/v1/net-cash')
                    .then(response => {
                        this.net_profit = response.data
                    })
                    .catch(error => {
                        console.log(JSON.stringify(error))
                    })
            },
            getGrossProfit() {

                axios
                    .get('/api/v1/gross-profit')
                    .then(response => {
                        this.gross_profit = response.data
                    })
                    .catch(error => {
                        console.log(JSON.stringify(error))
                    })
            },
            getSalesTaxes() {

                axios
                    .get('/api/v1/taxes')
                    .then(response => {
                        this.taxes = response.data
                    })
                    .catch(error => {
                        console.log(JSON.stringify(error))
                    })
            },
            getVAT() {

                axios
                    .get('/api/v1/vat')
                    .then(response => {
                        this.vat = response.data
                    })
                    .catch(error => {
                        console.log(JSON.stringify(error))
                    })
            },
            // getItemTotal(item) {
            //     const unit_price = item.unit_price
            //     const quantity = item.quantity
            //     const total = item.net_amount + (item.net_amount * (item.vat_rate / 100))

            //     return parseFloat(total).toFixed(2)
            // }
        }
    }
</script>
