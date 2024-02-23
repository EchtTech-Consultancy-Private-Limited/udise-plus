import React from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import schoolgraph from '../../assets/images/s-graph.svg'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import {useTranslation} from "react-i18next";
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/accessibility')(Highcharts);


(function (H) {
    H.seriesTypes.pie.prototype.animate = function (init) {
        const series = this,
            chart = series.chart,
            points = series.points,
            {
                animation
            } = series.options,
            {
                startAngleRad
            } = series;

        function fanAnimate(point, startAngleRad) {
            const graphic = point.graphic,
                args = point.shapeArgs;

            if (graphic && args) {

                graphic
                    // Set inital animation values
                    .attr({
                        start: startAngleRad,
                        end: startAngleRad,
                        opacity: 1
                    })
                    // Animate to the final position
                    .animate({
                        start: args.start,
                        end: args.end
                    }, {
                        duration: animation.duration / points.length
                    }, function () {
                        // On complete, start animating the next point
                        if (points[point.index + 1]) {
                            fanAnimate(points[point.index + 1], args.end);
                        }
                        // On the last point, fade in the data labels, then
                        // apply the inner size
                        if (point.index === series.points.length - 1) {
                            series.dataLabelsGroup.animate({
                                opacity: 1
                            },
                                void 0,
                                function () {
                                    points.forEach(point => {
                                        point.opacity = 1;
                                    });
                                    series.update({
                                        enableMouseTracking: true
                                    }, false);
                                    chart.update({
                                        plotOptions: {
                                            pie: {
                                                innerSize: '40%',
                                                borderRadius: 8
                                            }
                                        }
                                    });
                                });
                        }
                    });
            }
        }

        if (init) {
            // Hide points on init
            points.forEach(point => {
                point.opacity = 0;
            });
        } else {
            fanAnimate(points[0], startAngleRad);
        }
    };
}(Highcharts));

export default function SchoolDashboard() {
    const { t } = useTranslation();
    return (
        <>
            <section className="pgicategory vision-mission-card ptb-30">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 mb-4 p-0">
                            <h2 className="heading-blue">{t("school_dashboard")}</h2>
                        </div>
                        <div className="col-md-12 col-lg-12 p-0">
                            <div className="common-content text-start right-card-sec">
                                <div className="srid-card-se school-dashboard">
                                    <div className="row">
                                        <div className="col-md-9 col-lg-9">
                                            <div className="card-box row">
                                                <div className="col-md-6 mb-5">
                                                    <div className="main-text-c m-big">14.89 Lakhs</div>
                                                    <span className="sub-text-c text-green">{t("total_schools")}</span>
                                                </div>
                                                <div className="col-md-6 mb-5">
                                                    <div className="main-text-c m-big">11.96 Lakhs</div>
                                                    <span className="sub-text-c text-green">{t("secondary_schools")}</span>
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <div className="main-text-c m-big">11.96 Lakhs</div>
                                                    <span className="sub-text-c text-green">{t("higher_sec_school")}</span>
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <div className="main-text-c m-big">11.96 Lakhs</div>
                                                    <span className="sub-text-c text-green">{t("elementary_schools")}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <img src={schoolgraph} alt="graph icon" className='school-graph-icon' />
                                    </div>
                                </div>

                                <div className="card-box-impact tab-for-graph mt-4">
                                    <div className="row">
                                        <div className="col-md-12 col-lg-12">
                                            <div className="impact-box-content-education">
                                                <div className="text-btn-d">
                                                    <h2 className="heading-sm">{t("number_of_schools_management_wise")}</h2>
                                                    <div className='d-flex w-20'>
                                                        <button className='view-table-btn'> <span className="material-icons-round">table_view</span> View Table </button>
                                                        <button className='view-table-btn view-more-btn ms-1 highcharts-button-normal'> <span className="material-icons-round me-0">more_horiz</span></button>
                                                    </div>
                                                </div>

                                                <div className="piechart-box row mt-4">
                                                            <div className="col-md-12">
                                                                <HighchartsReact
                                                                    highcharts={Highcharts}
                                                                    options={{
                                                                        chart: {
                                                                            type: 'pie'
                                                                        },
                                                                        events: {
                                                                            beforePrint: function () {

                                                                            },
                                                                            afterPrint: function () {

                                                                            }
                                                                        },
                                                                        title: {
                                                                            text: 'Total Numbers of Student'
                                                                        },
                                                                        tooltip: {
                                                                            valueSuffix: '%'
                                                                        },
                                                                        credits: {
                                                                            enabled: false
                                                                        },
                                                                        plotOptions: {
                                                                            pie: {
                                                                                allowPointSelect: true,
                                                                                cursor: 'pointer',
                                                                                dataLabels: {
                                                                                    enabled: false
                                                                                },
                                                                                showInLegend: true
                                                                            },
                                                                            series: {

                                                                                allowPointSelect: true,
                                                                                cursor: 'pointer',
                                                                                dataLabels: [{
                                                                                    enabled: true,
                                                                                    distance: 20
                                                                                }, {
                                                                                    enabled: true,
                                                                                    distance: -40,
                                                                                    format: '{point.percentage:.1f}%',
                                                                                    style: {
                                                                                        fontSize: '1.2em',
                                                                                        textOutline: 'none',
                                                                                        opacity: 0.7
                                                                                    },
                                                                                    filter: {
                                                                                        operator: '>',
                                                                                        property: 'percentage',
                                                                                        value: 10
                                                                                    }
                                                                                }]
                                                                            }
                                                                        },
                                                                        legend: {
                                                                            layout: 'vertical',
                                                                            align: 'left',
                                                                            verticalAlign: 'middle',
                                                                            itemMarginTop: 10,
                                                                            itemMarginBottom: 10
                                                                        },
                                                                        series: [
                                                                            {
                                                                                name: 'Percentage',
                                                                                colorByPoint: true,
                                                                                data: [
                                                                                    {
                                                                                        name: 'Government',
                                                                                        y: 55,
                                                                                        color: '#F5BF55'
                                                                                    },
                                                                                    {
                                                                                        name: 'Private',
                                                                                        y: 15,
                                                                                        color: '#E6694A'
                                                                                    },
                                                                                    {
                                                                                        name: 'Aided',
                                                                                        y: 15,
                                                                                        color: '#BCE263'
                                                                                    },
                                                                                    {
                                                                                        name: 'Others',
                                                                                        y: 15,
                                                                                        color: '#751539'
                                                                                    }

                                                                                ]
                                                                            }
                                                                        ]
                                                                    }}
                                                                    // allowChartUpdate={true}
                                                                    immutable={true}
                                                                />
                                                            </div>
                                                        </div>

                                            </div>


                                        </div>

                                    </div>
                                </div>

                                <div className="card-box-impact tab-for-graph mt-4">
                                    <div className="row">
                                        <div className="col-md-12 col-lg-12">
                                            <div className="impact-box-content-education">
                                                <div className="text-btn-d">
                                                    <h2 className="heading-sm">{t("number_of_schools_by_level_of_education")}</h2>
                                                    <div className='d-flex w-20'>
                                                        <button className='view-table-btn'> <span className="material-icons-round">table_view</span> View Table </button>
                                                        <button className='view-table-btn view-more-btn ms-1'> <span className="material-icons-round me-0">more_horiz</span></button>
                                                    </div>
                                                </div>

                                                <div className="piechart-box row mt-4">
                                                            <div className="col-md-12">
                                                                <HighchartsReact
                                                                    highcharts={Highcharts}
                                                                    options={{
                                                                        chart: {
                                                                            type: 'pie'
                                                                        },
                                                                        events: {
                                                                            beforePrint: function () {

                                                                            },
                                                                            afterPrint: function () {

                                                                            }
                                                                        },
                                                                        // title: {
                                                                        //     text: 'Total Numbers of Student'
                                                                        // },
                                                                        tooltip: {
                                                                            valueSuffix: '%'
                                                                        },
                                                                        credits: {
                                                                            enabled: false
                                                                        },
                                                                        plotOptions: {
                                                                            pie: {
                                                                                allowPointSelect: true,
                                                                                cursor: 'pointer',
                                                                                dataLabels: {
                                                                                    enabled: false
                                                                                },
                                                                                showInLegend: true
                                                                            },
                                                                            series: {

                                                                                allowPointSelect: true,
                                                                                cursor: 'pointer',
                                                                                dataLabels: [{
                                                                                    enabled: true,
                                                                                    distance: 20
                                                                                }, {
                                                                                    enabled: true,
                                                                                    distance: -40,
                                                                                    format: '{point.percentage:.1f}%',
                                                                                    style: {
                                                                                        fontSize: '1.2em',
                                                                                        textOutline: 'none',
                                                                                        opacity: 0.7
                                                                                    },
                                                                                    filter: {
                                                                                        operator: '>',
                                                                                        property: 'percentage',
                                                                                        value: 10
                                                                                    }
                                                                                }]
                                                                            }
                                                                        },
                                                                        legend: {
                                                                            layout: 'vertical',
                                                                            align: 'left',
                                                                            verticalAlign: 'middle',
                                                                            itemMarginTop: 10,
                                                                            itemMarginBottom: 10
                                                                        },
                                                                        series: [
                                                                            {
                                                                                name: 'Percentage',
                                                                                colorByPoint: true,
                                                                                data: [
                                                                                    {
                                                                                        name: 'Elementary',
                                                                                        y: 65,
                                                                                        color: '#BCE263'
                                                                                    },
                                                                                    {
                                                                                        name: 'Secondary',
                                                                                        y: 20,
                                                                                        color: '#751539'
                                                                                    },
                                                                                    {
                                                                                        name: 'Higher Secondary',
                                                                                        y: 15,
                                                                                        color: '#E6694A'
                                                                                    }
                                                                                ]
                                                                            }
                                                                        ]
                                                                    }}
                                                                    // allowChartUpdate={true}
                                                                    immutable={true}
                                                                />
                                                            </div>
                                                        </div>

                                            </div>


                                        </div>

                                    </div>
                                </div>

                                <div className="card-box-impact tab-for-graph mt-4">
                                    <div className="row">
                                        <div className="col-md-12 col-lg-12">
                                            <div className="impact-box-content-education">
                                                <div className="text-btn-d">
                                                    <h2 className="heading-sm" style={{ whiteSpace: 'pre-line' }}>{t("number_of_schools_based_on_school_types")}</h2>
                                                    <div className='d-flex w-20'>
                                                        <button className='view-table-btn'> <span className="material-icons-round">table_view</span> View Table </button>
                                                        <button className='view-table-btn view-more-btn ms-1'> <span className="material-icons-round me-0">more_horiz</span></button>
                                                    </div>
                                                </div>

                                                <div className="piechart-box row mt-4">
                                                            <div className="col-md-12">
                                                                <HighchartsReact
                                                                    highcharts={Highcharts}
                                                                    options={{
                                                                        chart: {
                                                                            type: 'pie'
                                                                        },
                                                                        events: {
                                                                            beforePrint: function () {

                                                                            },
                                                                            afterPrint: function () {

                                                                            }
                                                                        },
                                                                        // title: {
                                                                        //     text: 'Total Numbers of Student'
                                                                        // },
                                                                        tooltip: {
                                                                            valueSuffix: '%'
                                                                        },
                                                                        credits: {
                                                                            enabled: false
                                                                        },
                                                                        plotOptions: {
                                                                            pie: {
                                                                                allowPointSelect: true,
                                                                                cursor: 'pointer',
                                                                                dataLabels: {
                                                                                    enabled: false
                                                                                },
                                                                                showInLegend: true
                                                                            },
                                                                            series: {

                                                                                allowPointSelect: true,
                                                                                cursor: 'pointer',
                                                                                dataLabels: [{
                                                                                    enabled: true,
                                                                                    distance: 20
                                                                                }, {
                                                                                    enabled: true,
                                                                                    distance: -40,
                                                                                    format: '{point.percentage:.1f}%',
                                                                                    style: {
                                                                                        fontSize: '1.2em',
                                                                                        textOutline: 'none',
                                                                                        opacity: 0.7
                                                                                    },
                                                                                    filter: {
                                                                                        operator: '>',
                                                                                        property: 'percentage',
                                                                                        value: 10
                                                                                    }
                                                                                }]
                                                                            }
                                                                        },
                                                                        legend: {
                                                                            layout: 'vertical',
                                                                            align: 'left',
                                                                            verticalAlign: 'middle',
                                                                            itemMarginTop: 10,
                                                                            itemMarginBottom: 10
                                                                        },
                                                                        series: [
                                                                            {
                                                                                name: 'Percentage',
                                                                                colorByPoint: true,
                                                                                data: [
                                                                                    {
                                                                                        name: 'Boys',
                                                                                        y: 65,
                                                                                        color: '#57C1BB'
                                                                                    },
                                                                                    {
                                                                                        name: 'Girls',
                                                                                        y: 20,
                                                                                        color: '#E6694A'
                                                                                    },
                                                                                    {
                                                                                        name: 'Co-Ed',
                                                                                        y: 15,
                                                                                        color: '#BCE263'
                                                                                    }
                                                                                ]
                                                                            }
                                                                        ]
                                                                    }}
                                                                    // allowChartUpdate={true}
                                                                    immutable={true}
                                                                />
                                                            </div>
                                                        </div>

                                            </div>


                                        </div>

                                    </div>
                                </div>

                               
                                <div className="card-box-impact tab-for-graph mt-4">
                                    <div className="row">
                                        <div className="col-md-12 col-lg-12">
                                            <div className="impact-box-content-education">
                                                <div className="text-btn-d">
                                                    <h2 className="heading-sm">Number of Schools by Type and School Category</h2>
                                                    <div className='d-flex w-20'>
                                                        <button className='view-table-btn'> <span className="material-icons-round">table_view</span> View Table </button>
                                                        <button className='view-table-btn view-more-btn ms-1'> <span className="material-icons-round me-0">more_horiz</span></button>
                                                    </div>
                                                </div>

                                                <Tabs defaultActiveKey="Elementary" id="uncontrolled-tab-example" className="">

                                                    <Tab eventKey="Elementary" title="Elementary">

                                                        <div className="piechart-box row mt-4">
                                                            <div className="col-md-12">
                                                                <HighchartsReact
                                                                    highcharts={Highcharts}
                                                                    options={{
                                                                        chart: {
                                                                            type: 'pie'
                                                                        },
                                                                        events: {
                                                                            beforePrint: function () {

                                                                            },
                                                                            afterPrint: function () {

                                                                            }
                                                                        },
                                                                        title: {
                                                                            text: 'Total Numbers of Student'
                                                                        },
                                                                        tooltip: {
                                                                            valueSuffix: '%'
                                                                        },
                                                                        credits: {
                                                                            enabled: false
                                                                        },
                                                                        plotOptions: {
                                                                            pie: {
                                                                                allowPointSelect: true,
                                                                                cursor: 'pointer',
                                                                                dataLabels: {
                                                                                    enabled: false
                                                                                },
                                                                                showInLegend: true
                                                                            },
                                                                            series: {

                                                                                allowPointSelect: true,
                                                                                cursor: 'pointer',
                                                                                dataLabels: [{
                                                                                    enabled: true,
                                                                                    distance: 20
                                                                                }, {
                                                                                    enabled: true,
                                                                                    distance: -40,
                                                                                    format: '{point.percentage:.1f}%',
                                                                                    style: {
                                                                                        fontSize: '1.2em',
                                                                                        textOutline: 'none',
                                                                                        opacity: 0.7
                                                                                    },
                                                                                    filter: {
                                                                                        operator: '>',
                                                                                        property: 'percentage',
                                                                                        value: 10
                                                                                    }
                                                                                }]
                                                                            }
                                                                        },
                                                                        legend: {
                                                                            layout: 'vertical',
                                                                            align: 'left',
                                                                            verticalAlign: 'middle',
                                                                            itemMarginTop: 10,
                                                                            itemMarginBottom: 10
                                                                        },
                                                                        series: [
                                                                            {
                                                                                name: 'Percentage',
                                                                                colorByPoint: true,
                                                                                data: [
                                                                                    {
                                                                                        name: 'Elementary',
                                                                                        y: 65,
                                                                                        color: '#BCE263'
                                                                                    },
                                                                                    {
                                                                                        name: 'Secondary',
                                                                                        y: 20,
                                                                                        color: '#751539'
                                                                                    },
                                                                                    {
                                                                                        name: 'Higher Secondory',
                                                                                        y: 15,
                                                                                        color: '#E6694A'
                                                                                    }

                                                                                ]
                                                                            }
                                                                        ]
                                                                    }}
                                                                    // allowChartUpdate={true}
                                                                    immutable={true}
                                                                />
                                                            </div>
                                                        </div>

                                                    </Tab>
                                                    <Tab eventKey="Secondary" title="Secondary">
                                                    <div className="piechart-box row mt-4">
                                                            <div className="col-md-12">
                                                                <HighchartsReact
                                                                    highcharts={Highcharts}
                                                                    options={{
                                                                        chart: {
                                                                            type: 'pie'
                                                                        },
                                                                        events: {
                                                                            beforePrint: function () {

                                                                            },
                                                                            afterPrint: function () {

                                                                            }
                                                                        },
                                                                        title: {
                                                                            text: 'Total Numbers of Student'
                                                                        },
                                                                        tooltip: {
                                                                            valueSuffix: '%'
                                                                        },
                                                                        credits: {
                                                                            enabled: false
                                                                        },
                                                                        plotOptions: {
                                                                            pie: {
                                                                                allowPointSelect: true,
                                                                                cursor: 'pointer',
                                                                                dataLabels: {
                                                                                    enabled: false
                                                                                },
                                                                                showInLegend: true
                                                                            },
                                                                            series: {

                                                                                allowPointSelect: true,
                                                                                cursor: 'pointer',
                                                                                dataLabels: [{
                                                                                    enabled: true,
                                                                                    distance: 20
                                                                                }, {
                                                                                    enabled: true,
                                                                                    distance: -40,
                                                                                    format: '{point.percentage:.1f}%',
                                                                                    style: {
                                                                                        fontSize: '1.2em',
                                                                                        textOutline: 'none',
                                                                                        opacity: 0.7
                                                                                    },
                                                                                    filter: {
                                                                                        operator: '>',
                                                                                        property: 'percentage',
                                                                                        value: 10
                                                                                    }
                                                                                }]
                                                                            }
                                                                        },
                                                                        legend: {
                                                                            layout: 'vertical',
                                                                            align: 'left',
                                                                            verticalAlign: 'middle',
                                                                            itemMarginTop: 10,
                                                                            itemMarginBottom: 10
                                                                        },
                                                                        series: [
                                                                            {
                                                                                name: 'Percentage',
                                                                                colorByPoint: true,
                                                                                data: [
                                                                                    {
                                                                                        name: 'Elementary',
                                                                                        y: 65,
                                                                                        color: '#BCE263'
                                                                                    },
                                                                                    {
                                                                                        name: 'Secondary',
                                                                                        y: 20,
                                                                                        color: '#751539'
                                                                                    },
                                                                                    {
                                                                                        name: 'Higher Secondory',
                                                                                        y: 15,
                                                                                        color: '#E6694A'
                                                                                    }

                                                                                ]
                                                                            }
                                                                        ]
                                                                    }}
                                                                    // allowChartUpdate={true}
                                                                    immutable={true}
                                                                />
                                                            </div>
                                                        </div>
                                                    </Tab>
                                                    <Tab eventKey="Higher Secondory" title="Higher Secondory">
                                                    <div className="piechart-box row mt-4">
                                                            <div className="col-md-12">
                                                                <HighchartsReact
                                                                    highcharts={Highcharts}
                                                                    options={{
                                                                        chart: {
                                                                            type: 'pie'
                                                                        },
                                                                        events: {
                                                                            beforePrint: function () {

                                                                            },
                                                                            afterPrint: function () {

                                                                            }
                                                                        },
                                                                        title: {
                                                                            text: 'Total Numbers of Student'
                                                                        },
                                                                        tooltip: {
                                                                            valueSuffix: '%'
                                                                        },
                                                                        credits: {
                                                                            enabled: false
                                                                        },
                                                                        plotOptions: {
                                                                            pie: {
                                                                                allowPointSelect: true,
                                                                                cursor: 'pointer',
                                                                                dataLabels: {
                                                                                    enabled: false
                                                                                },
                                                                                showInLegend: true
                                                                            },
                                                                            series: {

                                                                                allowPointSelect: true,
                                                                                cursor: 'pointer',
                                                                                dataLabels: [{
                                                                                    enabled: true,
                                                                                    distance: 20
                                                                                }, {
                                                                                    enabled: true,
                                                                                    distance: -40,
                                                                                    format: '{point.percentage:.1f}%',
                                                                                    style: {
                                                                                        fontSize: '1.2em',
                                                                                        textOutline: 'none',
                                                                                        opacity: 0.7
                                                                                    },
                                                                                    filter: {
                                                                                        operator: '>',
                                                                                        property: 'percentage',
                                                                                        value: 10
                                                                                    }
                                                                                }]
                                                                            }
                                                                        },
                                                                        legend: {
                                                                            layout: 'vertical',
                                                                            align: 'left',
                                                                            verticalAlign: 'middle',
                                                                            itemMarginTop: 10,
                                                                            itemMarginBottom: 10
                                                                        },
                                                                        series: [
                                                                            {
                                                                                name: 'Percentage',
                                                                                colorByPoint: true,
                                                                                data: [
                                                                                    {
                                                                                        name: 'Elementary',
                                                                                        y: 65,
                                                                                        color: '#BCE263'
                                                                                    },
                                                                                    {
                                                                                        name: 'Secondary',
                                                                                        y: 20,
                                                                                        color: '#751539'
                                                                                    },
                                                                                    {
                                                                                        name: 'Higher Secondory',
                                                                                        y: 15,
                                                                                        color: '#E6694A'
                                                                                    }

                                                                                ]
                                                                            }
                                                                        ]
                                                                    }}
                                                                    // allowChartUpdate={true}
                                                                    immutable={true}
                                                                />
                                                            </div>
                                                        </div>
                                                    </Tab>

                                                </Tabs>


                                            </div>


                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>

    )
}
