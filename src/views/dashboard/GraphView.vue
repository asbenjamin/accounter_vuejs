<template>
    <div>
        <canvas id="graph-view"></canvas>
    </div>
</template>

<script>
import axios from 'axios'
import Chart from 'chart.js'
// https://www.digitalocean.com/community/tutorials/vuejs-vue-chart-js

export default {
    name: 'Graph',
    data() {
        return {
            chart: {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [
                        {
                            label: "Sales",
                            data: [],
                            backgroundColor: "rgba(54,73,93,.5)",
                            borderColor: "#36495d",
                            borderWidth: 3
                        }
                    ]
                },
                options: {
                    responsive: true,
                    lineTension: 1,
                    scales: {
                        yAxes: [
                                {
                                ticks: {
                                    beginAtZero: true,
                                    padding: 25
                                }
                            }
                        ]
                    }
                }
            }
        }
    },
    async mounted() {
        this.getChart();

        const ctx = document.getElementById("graph-view");
        await new Chart(ctx, this.chart);
    },
    methods: {
        async getChart() {
            await 
                axios
                    .get('/api/v1/chart')
                    .then(response => {
                        this.chart.data.labels = (response.data["date"]);
                        this.chart.data.datasets[0].data = (response.data["total"].map(item => item["net_amount__sum"] || 0));

                        // console.log(this.chart.data.labels);
                        // console.log(this.chart.data.datasets[0].data);
                    })
                    .catch(error => {
                        console.log(JSON.stringify(error))
                    })
        },
    }
}
</script>
