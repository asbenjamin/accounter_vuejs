<template>
    <v-date-picker mode='single' tint-color='#f142f4' v-model='selectedDate' :theme-styles='themeStyles' is-double-paned
        is-inline>
    </v-date-picker>
    <p>Date: {{ selectedDate }}</p>
    <p>JSON: {{ JSON.stringify(selectedDate) }}</p>
</template>

<script>
// import { log } from 'console';

export default {
    name: 'Calendar',
    data() {
        return {
            selectedDate: '',
            themeStyles: {
                wrapper: {
                    border: '1',
                },
                header: {
                    color: '#fafafa',
                    backgroundColor: '#f142f4',
                    borderColor: '#404c59',
                    borderWidth: '1px 1px 0 1px',
                },
                headerVerticalDivider: {
                    borderLeft: '1px solid #404c59',
                },
                weekdays: {
                    color: '#ffffff',
                    backgroundColor: '#f142f4',
                    borderColor: '#ff0098',
                    borderWidth: '0 1px',
                    padding: '5px 0 10px 0',
                },
                weekdaysVerticalDivider: {
                    borderLeft: '1px solid #404c59',
                },
                weeks: {
                    border: '1px solid #dadada',
                },
            },
        };
    },
    async mounted(){
        await this.getDate()
    },
    methods: {
        getDate(){
            const date_now = this.selectedDate
            console.log(date_now)
        }
    }
}
</script>
