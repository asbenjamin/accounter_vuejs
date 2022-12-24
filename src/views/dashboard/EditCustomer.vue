<template>
    <div class="page-add-client">
        <nav class="breadcrumb" aria-label="breadcrumbs">
            <ul>
                <li><router-link to="/dashboard">Dashboard</router-link></li>
                <li><router-link to="/dashboard/customers">Customers</router-link></li>
                <li><router-link :to="{ name: 'Customer', params: { id: customer.id }}">{{ customer.name }}</router-link></li>
                <li class="is-active"><router-link :to="{ name: 'EditCustomer', params: { id: customer.id }}" aria-current="true">Edit</router-link></li>
            </ul>
        </nav>

        <div class="columns is-multiline">
            <div class="column is-12">
                <h1 class="title">Edit - {{ customer.name }}</h1>
            </div>

            <div class="column is-6">
                <div class="field">
                    <label>Name</label>
                    
                    <div class="control">
                        <input type="text" name="name" class="input" v-model="customer.name">
                    </div>
                </div>

                <div class="field">
                    <label>Email</label>
                    
                    <div class="control">
                        <input type="email" name="email" class="input" v-model="customer.email">
                    </div>
                </div>

                <div class="field">
                    <label>Address 1</label>
                    
                    <div class="control">
                        <input type="text" name="address1" class="input" v-model="customer.address1">
                    </div>
                </div>

                <div class="field">
                    <label>Address 2</label>
                    
                    <div class="control">
                        <input type="text" name="address2" class="input" v-model="customer.address2">
                    </div>
                </div>
            </div>

            <div class="column is-6">
                <div class="field">
                    <label>Zipcode</label>
                    
                    <div class="control">
                        <input type="text" name="zipcode" class="input" v-model="customer.zipcode">
                    </div>
                </div>

                <div class="field">
                    <label>Place</label>
                    
                    <div class="control">
                        <input type="text" name="place" class="input" v-model="customer.place">
                    </div>
                </div>

                <div class="field">
                    <label>Country</label>
                    
                    <div class="control">
                        <input type="text" name="country" class="input" v-model="customer.country">
                    </div>
                </div>
            </div>

            <div class="column is-12">
                <div class="field">
                    <div class="control">
                        <button class="button is-success" @click="submitForm">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { toast } from 'bulma-toast'

export default {
    name: 'EditCustomer',
    data() {
        return {
            customer: {}
        }
    },
    mounted() {
        this.getCustomer()
    },
    methods: {
        getCustomer() {
            const customerID = this.$route.params.id
            console.log(customerID)

            axios
                .get(`/api/v1/customers/${customerID}`)
                .then(response => {
                    this.customer = response.data
                })
                .catch(error => {
                    console.log(JSON.stringify(error))
                })
        },
        submitForm() {
            const customerID = this.$route.params.id
            console.log(customerID)

            axios
                .patch(`/api/v1/customers/${customerID}/`, this.customer)
                .then(response => {
                    toast({
                        message: 'The changes was saved',
                        type: 'is-success',
                        dismissible: true,
                        pauseOnHover: true,
                        duration: 2000,
                        position: 'bottom-right',
                    })
                    
                    this.$router.push('/dashboard/customers')
                })
                .catch(error => {
                    console.log(JSON.stringify(error))
                })
        }
    }
}
</script>
