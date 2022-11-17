<template>
    <div class="page-clients">
        <nav class="breadcrumb" aria-label="breadcrumbs">
            <ul>
                <li><router-link to="/dashboard">Dashboard</router-link></li>
                <li class="is-active"><router-link to="/dashboard/customers" aria-current="true">Customers</router-link></li>
            </ul>
        </nav>

        <div class="columns is-multiline">
            <div class="column is-12">
                <h1 class="title">Customers</h1>

                <router-link :to="{ name: 'AddCustomer' }" class="button is-light mt-4">Add Customer</router-link>
            </div>

            <div
                class="column is-3"
                v-for="customer in customers"
                v-bind:key="customer.id"
            >
                <div class="box">
                    <h3 class="is-size-4 mb-4">{{ customer.name }}</h3>

                    <router-link :to="{ name: 'Customer', params: { id: customer.id }}" class="button is-light">Details</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'Customers',
    data() {
        return {
            customers: []
        }
    },
    mounted() {
        this.getCustomers()
    },
    methods: {
        getCustomers() {
            axios
                .get('/api/v1/customers/')
                .then(response => {
                    for (let i = 0; i < response.data.length; i++) {
                        this.customers.push(response.data[i])
                    }
                })
                .catch(error => {
                    console.log(JSON.stringify(error))
                })
        }
    }
}
</script>
