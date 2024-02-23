import React from 'react';
import pen from '../../assets/images/pen.svg'
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

var breaks = [];

export default function TeacherDashboard() {
    const { t } = useTranslation();
    return (
        <>
            <section className="pgicategory vision-mission-card ptb-30">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 mb-4 p-0">
                            <h2 className="heading-blue">{t("teacher_dashboard")}</h2>
                        </div>
                        <div className="col-md-12 col-lg-12 p-0">
                            <div className="common-content text-start right-card-sec">
                                <div className="srid-card-se school-dashboard">
                                    <div className="row">
                                        <div className="col-md-9 col-lg-9">
                                            <div className="card-box row">
                                                <div className="col-md-6 mb-5">
                                                    <div className="main-text-c m-big">95.07 Lakhs</div>
                                                    <span className="sub-text-c text-green">Total Teachers</span>
                                                </div>
                                                <div className="col-md-6 mb-5">
                                                    <div className="main-text-c m-big">51.85 Lakhs</div>
                                                    <span className="sub-text-c text-green">Elementary Teachers</span>
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <div className="main-text-c m-big">16.20 Lakhs</div>
                                                    <span className="sub-text-c text-green">Secondary Teachers</span>
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <div className="main-text-c m-big">27.01 Lakhs</div>
                                                    <span className="sub-text-c text-green">Higher Sec. Teachers</span>
                                                </div>
                                            </div>
                                        </div>
                                        <img src={pen} alt="graph icon" className='school-graph-icon icon-h-big Teacher_dashboard-icon' />
                                    </div>
                                </div>

                                <div className="card-box-impact tab-for-graph mt-4">
                                    <div className="row">
                                        <div className="col-md-12 col-lg-12">
                                            <div className="impact-box-content-education">
                                                <div className="text-btn-d">
                                                    <h2 className="heading-sm">Number of Teachers Management-Wise</h2>
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
                                                    <h2 className="heading-sm">Number of Teachers by Level of Education</h2>
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
                                                    <h2 className="heading-sm">Number of Male - Female Teacher</h2>
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
                                                                    type: 'column'
                                                                },
                                                                xAxis: {
                                                                    categories: ['Government', 'Aided', 'Private', 'Others'],
                                                                    title: {
                                                                        text: null
                                                                    },
                                                                    gridLineWidth: 1,
                                                                    lineWidth: 0
                                                                },
                                                                yAxis: {
                                                                    min: 0,
                                                                    title: {
                                                                        // text: 'Population (millions)',
                                                                        // align: 'high'
                                                                        enabled: false
                                                                    },
                                                                    labels: {
                                                                        overflow: 'justify'
                                                                    },
                                                                    gridLineWidth: 0
                                                                },
                                                                tooltip: {
                                                                    valueSuffix: 'k'
                                                                },
                                                                plotOptions: {
                                                                    bar: {
                                                                        borderRadius: '50%',
                                                                        dataLabels: {
                                                                            enabled: true
                                                                        },
                                                                        groupPadding: 0.1,
                                                                    }
                                                                },
                                                                legend: {
                                                                    layout: 'vertical',
                                                                    align: 'right',
                                                                    verticalAlign: 'top',
                                                                    x: -40,
                                                                    y: 80,
                                                                    floating: true,
                                                                    borderWidth: 1,
                                                                    backgroundColor:
                                                                        Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
                                                                    shadow: true
                                                                },
                                                                credits: {
                                                                    enabled: false
                                                                },
                                                                series: [{
                                                                    name: 'Female',
                                                                    data: [2100, 500, 2200, 300],                                                                    
                                                                    color: "#751539"
                                                                }, {                                                                  

                                                                    name: 'Male',
                                                                    data: [2800, 700, 2600, 500],
                                                                    color: "#57C1BB"
                                                                }]
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
                                                    <h2 className="heading-sm">Pupil Teacher Ratio</h2>
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
                                                                  type: 'column',
                                                                  ignoreHiddenSeries: true,
                                                                  events: {
                                                                    load: function() {
                                                                      Highcharts.each(this.series, function() {
                                                                        breaks.push({});
                                                                      });
                                                                    },
                                                                  }
                                                                },
                                                                plotOptions: {
                                                                  column: {
                                                                    grouping: false,
                                                                    pointPlacement: null,
                                                                    events: {
                                                                      legendItemClick: function() {
                                                                        if (!this.visible) {
                                                                            breaks[this.index] = {}
                                                                          this.chart.xAxis[0].update({
                                                                            breaks: breaks
                                                                          });
                                                                        } else {
                                                                          breaks[this.index] = {
                                                                            from: this.xData[0] - 0.5,
                                                                            to: this.xData[0] + 0.5,
                                                                            breakSize: 0
                                                                          }
                                                                          this.chart.xAxis[0].update({
                                                                            breaks: breaks
                                                                          });
                                                                        }
                                                                      }
                                                                    }
                                                                  },
                                                                },
                                                                xAxis: {
                                                                  categories: ['Primary', 'Upper Primary', 'Secondary', 'Higher Secondary'],
                                                                  startOnTick: true
                                                                },
                                                                yAxis: {
                                                                    min: 0,
                                                                    title: {
                                                                        // text: 'Population (millions)',
                                                                        // align: 'high'
                                                                        enabled: false
                                                                    },
                                                                    labels: {
                                                                        overflow: 'justify'
                                                                    },
                                                                    gridLineWidth: 0
                                                                },
                                                                legend: {
                                                                    layout: 'vertical',
                                                                    align: 'right',
                                                                    verticalAlign: 'top',
                                                                    x: -150,
                                                                    y: 0,
                                                                    floating: true,
                                                                    borderWidth: 1,
                                                                    backgroundColor:
                                                                        Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
                                                                    shadow: true
                                                                },
                                                                credits: {
                                                                    enabled: false
                                                                },
                                                                series: [{
                                                                  name: 'Primary',
                                                                  color:'#BCE263',
                                                                  data: [{
                                                                    name: 'Primary',
                                                                    y:26.16,
                                                                    x: 0,
                                                                    color:'#BCE263'
                                                                  }]
                                                                }, {
                                                                  name: 'Upper Primary',
                                                                  color:'#751539',
                                                                  data: [{
                                                                    name: 'Upper Primary',
                                                                    y: 19.44,
                                                                    x: 1,
                                                                    color:'#751539'
                                                                  }]
                                                                }, {
                                                                  name: 'Secondary',
                                                                  color:'#E6694A',
                                                                  data: [{
                                                                    name: 'Secondary',
                                                                    y: 17.6,
                                                                    x: 2,
                                                                    color:'#E6694A'
                                                                  }]
                                                                }, {
                                                                  name: 'Higher Secondary',
                                                                  color:'#57C1BB',  
                                                                  data: [{
                                                                    name: 'Higher Secondary',
                                                                    y: 27.08,
                                                                    x: 3,
                                                                    color:'#57C1BB'
                                                                  }]
                                                                }]
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
                               

                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>

    )
}
