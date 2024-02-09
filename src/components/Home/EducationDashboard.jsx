import React from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import school from '../../assets/images/school.svg'
import Teachers from '../../assets/images/teachers.svg'
import Students from '../../assets/images/students.svg'
import ArrowUP from '../../assets/images/arrow-upper.svg'
import Arrowdown from '../../assets/images/arrow-lower.svg'
import std1 from '../../assets/images/student1.svg'
import std2 from '../../assets/images/student2.svg'
import drinkinwater from '../../assets/images/noun-drinking-water.svg'
import power from '../../assets/images/noun-power.svg'
import transition_img from '../../assets/images/Transition.svg'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
// require('highcharts/modules/exporting')(Highcharts);
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

export default function EducationDashboard() {
    return (
        <>
            <section className="pgicategory vision-mission-card ptb-30">
                <div className="container">
                    <div className="row">
                    <div className="col-md-12 mb-4 p-0">
                            <h2 className="heading-blue">Education Dashboard</h2>
                        </div>
                        <div className="col-md-12 col-lg-12 p-0">
                            <div className="common-content text-start right-card-sec">
                                <div className="srid-card-se">
                                    <div className="row">
                                        <div className="col-md-4 col-lg-4">
                                            <div className="card-box">
                                                <img src={school} alt="school" className='card-img' />
                                                <i className="sub-text-c text-green">No. Of School</i>
                                                <div className="main-text-c m-big">14891115</div>

                                                <span className="sub-text-c">Urban</span>
                                                <div className="main-text-c">2.54 Lakhs</div>

                                                <span className="sub-text-c">Rural</span>
                                                <div className="main-text-c">12.34 Lakhs</div>
                                            </div>
                                        </div>
                                        <div className="col-md-4 col-lg-4">
                                            <div className="card-box">
                                                <img src={Teachers} alt="Teachers" className='card-img' />
                                                <i className="sub-text-c text-green">No. Of Teachers</i>
                                                <div className="main-text-c m-big">9507123</div>

                                                <span className="sub-text-c">Urban</span>
                                                <div className="main-text-c">48.76 Lakhs</div>

                                                <span className="sub-text-c">Rural</span>
                                                <div className="main-text-c">46.30 Lakhs</div>
                                            </div>
                                        </div>
                                        <div className="col-md-4 col-lg-4">
                                            <div className="card-box">
                                                <img src={Students} alt="Students" className='card-img' />
                                                <i className="sub-text-c text-green">No. Of Students</i>
                                                <div className="main-text-c m-big">265235830</div>

                                                <span className="sub-text-c">Urban</span>
                                                <div className="main-text-c">12.73 Lakhs</div>

                                                <span className="sub-text-c">Rural</span>
                                                <div className="main-text-c">13.79 Lakhs</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-box-impact mt-4">
                                    <div className="row">
                                        <div className="col-md-12 mb-4">
                                            <h2 className="heading-sm">Impact of Various Schemes and Initiatives</h2>
                                        </div>


                                        <div className="col-md-4 col-lg-4">
                                            <div className="impact-box-content">
                                                <img src={ArrowUP} alt="school" className='card-img-impact' />
                                                <div className="main-text-c m-big">Gross Enrollment <br /> Ratio</div>

                                                <div className="main-text-c">Elementry</div>
                                                <span className="sub-text-c">100.13%</span>

                                                <div className="main-text-c">Secondry</div>
                                                <span className="sub-text-c">79.86%</span>
                                            </div>
                                        </div>

                                        <div className="col-md-4 col-lg-4">
                                            <div className="impact-box-content">
                                                <img src={Arrowdown} alt="school" className='card-img-impact' />
                                                <div className="main-text-c m-big">Dropout <br /> Rate</div>

                                                <div className="main-text-c">Primary</div>
                                                <span className="sub-text-c">100.13%</span>

                                                <div className="main-text-c">Secondry</div>
                                                <span className="sub-text-c">79.86%</span>
                                            </div>
                                        </div>

                                        <div className="col-md-4 col-lg-4">
                                            <div className="impact-box-content">
                                                <img src={transition_img} alt="school" className='card-img-impact' />
                                               
                                                <div className="main-text-c m-big">Transition <br /> Rate</div>

                                                <div className="main-text-c">Primary to Upper Primary</div>
                                                <span className="sub-text-c">100.13%</span>

                                                <div className="main-text-c">Upper Primary to Secondary</div>
                                                <span className="sub-text-c">79.86%</span>
                                            </div>
                                        </div>

                                        <div className="col-md-4 col-lg-4">
                                            <div className="impact-box-content">
                                            <div className="img-multi-box">
                                                <img src={std1} alt="school" />
                                                <img src={std2} alt="school" className='big-img'/>
                                                <img src={std1} alt="school" />
                                                </div>
                                                <div className="main-text-c m-big">Pupil - Teacher <br /> Ratio</div>

                                                <div className="main-text-c">Primary</div>
                                                <span className="sub-text-c">100.13%</span>

                                                <div className="main-text-c">Upper Primary</div>
                                                <span className="sub-text-c">79.86%</span>
                                            </div>
                                        </div>

                                        <div className="col-md-4 col-lg-4">
                                            <div className="impact-box-content">
                                                <img src={drinkinwater} alt="school" className='card-img-impact' />
                                                <div className="main-text-c m-big">Schools with Drinking Water</div>

                                                <span className="sub-text-c sub-main-text">97.6%</span>
                                            </div>
                                        </div>

                                        <div className="col-md-4 col-lg-4">
                                            <div className="impact-box-content">
                                                <img src={power} alt="school" className='card-img-impact' />
                                                <div className="main-text-c m-big">Schools with Electricity Connection</div>
                                                <span className="sub-text-c sub-main-text">97.6%</span>
                                            </div>
                                        </div>
                                        <div className="col-md-4 col-lg-4">
                                            <div className="impact-box-content">
                                                <img src={ArrowUP} alt="school" className='card-img-impact' />
                                                <div className="main-text-c m-big">Gross Enrollment <br /> Ratio</div>

                                                <div className="main-text-c">Elementry</div>
                                                <span className="sub-text-c">100.13%</span>

                                                <div className="main-text-c">Secondry</div>
                                                <span className="sub-text-c">79.86%</span>
                                            </div>
                                        </div>

                                        <div className="col-md-4 col-lg-4"> 
                                            <div className="impact-box-content">
                                                <img src={Arrowdown} alt="school" className='card-img-impact' />
                                                <div className="main-text-c m-big">Dropout <br /> Rate</div>

                                                <div className="main-text-c">Primary</div>
                                                <span className="sub-text-c">100.13%</span>

                                                <div className="main-text-c">Secondry</div>
                                                <span className="sub-text-c">79.86%</span>
                                            </div>
                                        </div>

                                        <div className="col-md-4 col-lg-4">
                                            <div className="impact-box-content">
                                            <img src={transition_img} alt="school" className='card-img-impact' />
                                               
                                                <div className="main-text-c m-big">Transition <br /> Rate</div>

                                                <div className="main-text-c">Primary to Upper Primary</div>
                                                <span className="sub-text-c">100.13%</span>

                                                <div className="main-text-c">Upper Primary to Secondary</div>
                                                <span className="sub-text-c">79.86%</span>
                                            </div>
                                        </div>

                                        <div className="col-md-4 col-lg-4">
                                            <div className="impact-box-content">
                                            <div className="img-multi-box">
                                                <img src={std1} alt="school" />
                                                <img src={std2} alt="school" className='big-img'/>
                                                <img src={std1} alt="school" />
                                                </div>
                                                <div className="main-text-c m-big">Pupil - Teacher <br /> Ratio</div>

                                                <div className="main-text-c">Primary</div>
                                                <span className="sub-text-c">100.13%</span>

                                                <div className="main-text-c">Upper Primary</div>
                                                <span className="sub-text-c">79.86%</span>
                                            </div>
                                        </div>

                                        <div className="col-md-4 col-lg-4">
                                            <div className="impact-box-content">
                                                <img src={drinkinwater} alt="school" className='card-img-impact' />
                                                <div className="main-text-c m-big">Schools with Drinking Water</div>

                                                <span className="sub-text-c sub-main-text">97.6%</span>
                                            </div>
                                        </div>

                                        <div className="col-md-4 col-lg-4">
                                            <div className="impact-box-content">
                                                <img src={power} alt="school" className='card-img-impact' />
                                                <div className="main-text-c m-big">Schools with Electricity Connection</div>
                                                <span className="sub-text-c sub-main-text">97.6%</span>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <div className="card-box-impact tab-for-graph mt-4">
                                    <div className="row">
                                        <div className="col-md-12 col-lg-12">
                                            <div className="impact-box-content-education">
                                                <div className="text-btn-d">
                                                    <h2 className="heading-sm">Education Data By Management Type</h2>
                                                    <div className='d-flex w-20'>
                                                        <button className='view-table-btn'> <span className="material-icons-round">table_view</span> View Table </button>
                                                        <button className='view-table-btn view-more-btn ms-1'> <span className="material-icons-round me-0">more_horiz</span></button>
                                                    </div>
                                                </div>

                                                <Tabs defaultActiveKey="School" id="uncontrolled-tab-example" className="">

                                                    <Tab eventKey="School" title="School">

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
                                                                                        y: 45,
                                                                                        color: '#F5BF55'
                                                                                    },
                                                                                    {
                                                                                        name: 'Private',
                                                                                        y: 25,
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

                                                    </Tab>
                                                    <Tab eventKey="Teacher" title="Teacher">
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
                                                                                        y: 40,
                                                                                        color: '#F5BF55'
                                                                                    },
                                                                                    {
                                                                                        name: 'Private',
                                                                                        y: 25,
                                                                                        color: '#E6694A'
                                                                                    },
                                                                                    {
                                                                                        name: 'Aided',
                                                                                        y: 20,
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
                                                    </Tab>
                                                    <Tab eventKey="Student" title="Student">
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
                                                                                        y: 35,
                                                                                        color: '#F5BF55'
                                                                                    },
                                                                                    {
                                                                                        name: 'Private',
                                                                                        y: 25,
                                                                                        color: '#E6694A'
                                                                                    },
                                                                                    {
                                                                                        name: 'Aided',
                                                                                        y: 25,
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
                                                    </Tab>

                                                </Tabs>



                                            </div>


                                        </div>

                                    </div>
                                </div>

                                <div className="card-box-impact tab-for-graph mt-4">
                                    <div className="row">
                                        <div className="col-md-12 col-lg-12">
                                            <div className="impact-box-content-education">
                                                <div className="text-btn-d">
                                                    <h2 className="heading-sm">Enrollement By Level Of Education & Gender</h2>
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
                                                                    type: 'bar'
                                                                },
                                                                xAxis: {
                                                                    categories: ['Higher-Secondory', 'Secondry', 'Upper Primary', 'Primary', 'Pre-Primary'],
                                                                    title: {
                                                                        text: null
                                                                    },
                                                                    gridLineWidth: 1,
                                                                    lineWidth: 0
                                                                },
                                                                yAxis: {
                                                                    min: 0,
                                                                    title: {
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
                                                                        groupPadding: 0.1
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
                                                                    name: 'Male',
                                                                    data: [20, 25, 35, 65, 10],
                                                                    color: "#751539"
                                                                }, {
                                                                    name: 'Female',
                                                                    data: [18, 20, 30, 60, 8],
                                                                    color: "#E6694A  "
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
                                                    <h2 className="heading-sm">Status of Infrastructure in Schools (Management Wise)</h2>
                                                    <div className='d-flex w-20'>
                                                        <button className='view-table-btn'> <span className="material-icons-round">table_view</span> View Table </button>
                                                        <button className='view-table-btn view-more-btn ms-1'> <span className="material-icons-round me-0">more_horiz</span></button>
                                                    </div>
                                                </div>

                                                <Tabs defaultActiveKey="Girl Toilet" id="uncontrolled-tab-example" className="">

                                                    <Tab eventKey="Girl Toilet" title="Girl Toilet">
                                                        <div className="piechart-box row mt-4">
                                                            <div className="col-md-12">
                                                                <HighchartsReact
                                                                    highcharts={Highcharts}
                                                                    options={{

                                                                        chart: {
                                                                            type: 'column'
                                                                        },

                                                                        xAxis: {
                                                                            categories: ['Govt.', 'Aided', 'Private', 'Other', 'Total']
                                                                        },

                                                                        yAxis: {
                                                                            allowDecimals: false,
                                                                            min: 0,
                                                                            title: {
                                                                                text: ''
                                                                            }
                                                                        },

                                                                        tooltip: {
                                                                            format: '<b>{key}</b><br/>{series.name}: {y}<br/>' +
                                                                                'Total: {point.stackTotal}'
                                                                        },

                                                                        plotOptions: {
                                                                            column: {
                                                                                stacking: 'normal',
                                                                                dataLabels:{
                                                                                    enabled:true,
                                                                                    crop: false,
                                                                                    overflow: "none",
                                                                                    rotation:0,
                                                                                    align: 'center',
                                                                                    x: -2,
                                                                                    y: -5,
                                                                                    style: {
                                                                                      color: 'black',
                                                                                      font: '10px Arial, sans-serif',
                                                                                      fontWeight: 'normal',
                                                                                    },
                                                                                    position:"top",
                                                                                    formatter: function () {
                                                                                      return this.y+ '%';
                                                                                      },
                                                                                  }
                                                                            }
                                                                        },
                                                                        legend: {
                                                                            layout: 'vertical',
                                                                            align: 'right',
                                                                            verticalAlign: 'middle',
                                                                            itemMarginTop: 10,
                                                                            itemMarginBottom: 10
                                                                        },
                                                                        credits: {
                                                                            enabled: false
                                                                        },
                                                                        series: [{
                                                                              name: 'Not Available',
                                                                            data: [4, 9, 2, 15, 3],
                                                                            color: "#E6694A"

                                                                        }, {
                                                                            name: 'Available',
                                                                            data: [96, 91, 98, 85, 97],
                                                                            color: "#BCE263"
                                                                        }]
                                                                    }}
                                                                    // allowChartUpdate={true}
                                                                    immutable={true}
                                                                />
                                                            </div>
                                                        </div>
                                                    </Tab>
                                                    <Tab eventKey="Library" title="Library">
                                                    <div className="piechart-box row mt-4">
                                                            <div className="col-md-12">
                                                                <HighchartsReact
                                                                    highcharts={Highcharts}
                                                                    options={{

                                                                        chart: {
                                                                            type: 'column'
                                                                        },

                                                                        xAxis: {
                                                                            categories: ['Govt.', 'Aided', 'Private', 'Other', 'Total']
                                                                        },

                                                                        yAxis: {
                                                                            allowDecimals: false,
                                                                            min: 0,
                                                                            title: {
                                                                                text: ''
                                                                            }
                                                                        },

                                                                        tooltip: {
                                                                            format: '<b>{key}</b><br/>{series.name}: {y}<br/>' +
                                                                                'Total: {point.stackTotal}'
                                                                        },

                                                                        plotOptions: {
                                                                            column: {
                                                                                stacking: 'normal'
                                                                            }
                                                                        },

                                                                        legend: {
                                                                            layout: 'vertical',
                                                                            align: 'right',
                                                                            verticalAlign: 'middle',
                                                                            itemMarginTop: 10,
                                                                            itemMarginBottom: 10
                                                                        },
                                                                        credits: {
                                                                            enabled: false
                                                                        },
                                                                        series: [{
                                                                            name: 'Not Available',
                                                                            data: [4, 9, 2, 15, 3],
                                                                            color: "#E6694A"

                                                                        }, {
                                                                            name: 'Available',
                                                                            data: [96, 91, 98, 85, 97],
                                                                            color: "#BCE263"
                                                                        }]
                                                                    }}
                                                                    // allowChartUpdate={true}
                                                                    immutable={true}
                                                                />
                                                            </div>
                                                        </div>
                                                    </Tab>
                                                    <Tab eventKey="Library With Books" title="Library With Books">
                                                    <div className="piechart-box row mt-4">
                                                            <div className="col-md-12">
                                                                <HighchartsReact
                                                                    highcharts={Highcharts}
                                                                    options={{

                                                                        chart: {
                                                                            type: 'column'
                                                                        },

                                                                        xAxis: {
                                                                            categories: ['Govt.', 'Aided', 'Private', 'Other', 'Total']
                                                                        },

                                                                        yAxis: {
                                                                            allowDecimals: false,
                                                                            min: 0,
                                                                            title: {
                                                                                text: ''
                                                                            }
                                                                        },

                                                                        tooltip: {
                                                                            format: '<b>{key}</b><br/>{series.name}: {y}<br/>' +
                                                                                'Total: {point.stackTotal}'
                                                                        },

                                                                        plotOptions: {
                                                                            column: {
                                                                                stacking: 'normal'
                                                                            }
                                                                        },

                                                                        legend: {
                                                                            layout: 'vertical',
                                                                            align: 'right',
                                                                            verticalAlign: 'middle',
                                                                            itemMarginTop: 10,
                                                                            itemMarginBottom: 10
                                                                        },
                                                                        credits: {
                                                                            enabled: false
                                                                        },
                                                                        series: [{
                                                                            name: 'Not Available',
                                                                            data: [4, 9, 2, 15, 3],
                                                                            color: "#E6694A"

                                                                        }, {
                                                                            name: 'Available',
                                                                            data: [96, 91, 98, 85, 97],
                                                                            color: "#BCE263"
                                                                        }]
                                                                    }}
                                                                    // allowChartUpdate={true}
                                                                    immutable={true}
                                                                />
                                                            </div>
                                                        </div>
                                                    </Tab>
                                                    <Tab eventKey="Electricity" title="Electricity">
                                                    <div className="piechart-box row mt-4">
                                                            <div className="col-md-12">
                                                                <HighchartsReact
                                                                    highcharts={Highcharts}
                                                                    options={{

                                                                        chart: {
                                                                            type: 'column'
                                                                        },

                                                                        xAxis: {
                                                                            categories: ['Govt.', 'Aided', 'Private', 'Other', 'Total']
                                                                        },

                                                                        yAxis: {
                                                                            allowDecimals: false,
                                                                            min: 0,
                                                                            title: {
                                                                                text: ''
                                                                            }
                                                                        },

                                                                        tooltip: {
                                                                            format: '<b>{key}</b><br/>{series.name}: {y}<br/>' +
                                                                                'Total: {point.stackTotal}'
                                                                        },

                                                                        plotOptions: {
                                                                            column: {
                                                                                stacking: 'normal'
                                                                            }
                                                                        },

                                                                        legend: {
                                                                            layout: 'vertical',
                                                                            align: 'right',
                                                                            verticalAlign: 'middle',
                                                                            itemMarginTop: 10,
                                                                            itemMarginBottom: 10
                                                                        },
                                                                        credits: {
                                                                            enabled: false
                                                                        },
                                                                        series: [{
                                                                            name: 'Not Available',
                                                                            data: [4, 9, 2, 15, 3],
                                                                            color: "#E6694A"

                                                                        }, {
                                                                            name: 'Available',
                                                                            data: [96, 91, 98, 85, 97],
                                                                            color: "#BCE263"
                                                                        }]
                                                                    }}
                                                                    // allowChartUpdate={true}
                                                                    immutable={true}
                                                                />
                                                            </div>
                                                        </div>
                                                    </Tab>
                                                    <Tab eventKey="Drinking Water" title="Drinking Water">
                                                    <div className="piechart-box row mt-4">
                                                            <div className="col-md-12">
                                                                <HighchartsReact
                                                                    highcharts={Highcharts}
                                                                    options={{

                                                                        chart: {
                                                                            type: 'column'
                                                                        },

                                                                        xAxis: {
                                                                            categories: ['Govt.', 'Aided', 'Private', 'Other', 'Total']
                                                                        },

                                                                        yAxis: {
                                                                            allowDecimals: false,
                                                                            min: 0,
                                                                            title: {
                                                                                text: ''
                                                                            }
                                                                        },

                                                                        tooltip: {
                                                                            format: '<b>{key}</b><br/>{series.name}: {y}<br/>' +
                                                                                'Total: {point.stackTotal}'
                                                                        },

                                                                        plotOptions: {
                                                                            column: {
                                                                                stacking: 'normal'
                                                                            }
                                                                        },

                                                                        legend: {
                                                                            layout: 'vertical',
                                                                            align: 'right',
                                                                            verticalAlign: 'middle',
                                                                            itemMarginTop: 10,
                                                                            itemMarginBottom: 10
                                                                        },
                                                                        credits: {
                                                                            enabled: false
                                                                        },
                                                                        series: [{
                                                                            name: 'Not Available',
                                                                            data: [4, 9, 2, 15, 3],
                                                                            color: "#E6694A"

                                                                        }, {
                                                                            name: 'Available',
                                                                            data: [96, 91, 98, 85, 97],
                                                                            color: "#BCE263"
                                                                        }]
                                                                    }}
                                                                    // allowChartUpdate={true}
                                                                    immutable={true}
                                                                />
                                                            </div>
                                                        </div>
                                                    </Tab>
                                                    <Tab eventKey="Handwash" title="Handwash">
                                                    <div className="piechart-box row mt-4">
                                                            <div className="col-md-12">
                                                                <HighchartsReact
                                                                    highcharts={Highcharts}
                                                                    options={{

                                                                        chart: {
                                                                            type: 'column'
                                                                        },

                                                                        xAxis: {
                                                                            categories: ['Govt.', 'Aided', 'Private', 'Other', 'Total']
                                                                        },

                                                                        yAxis: {
                                                                            allowDecimals: false,
                                                                            min: 0,
                                                                            title: {
                                                                                text: ''
                                                                            }
                                                                        },

                                                                        tooltip: {
                                                                            format: '<b>{key}</b><br/>{series.name}: {y}<br/>' +
                                                                                'Total: {point.stackTotal}'
                                                                        },

                                                                        plotOptions: {
                                                                            column: {
                                                                                stacking: 'normal'
                                                                            }
                                                                        },

                                                                        legend: {
                                                                            layout: 'vertical',
                                                                            align: 'right',
                                                                            verticalAlign: 'middle',
                                                                            itemMarginTop: 10,
                                                                            itemMarginBottom: 10
                                                                        },
                                                                        credits: {
                                                                            enabled: false
                                                                        },
                                                                        series: [{
                                                                            name: 'Not Available',
                                                                            data: [4, 9, 2, 15, 3],
                                                                            color: "#E6694A"

                                                                        }, {
                                                                            name: 'Available',
                                                                            data: [96, 91, 98, 85, 97],
                                                                            color: "#BCE263"
                                                                        }]
                                                                    }}
                                                                    // allowChartUpdate={true}
                                                                    immutable={true}
                                                                />
                                                            </div>
                                                        </div>
                                                    </Tab>
                                                    <Tab eventKey="Medical Facility" title="Medical Facility">
                                                    <div className="piechart-box row mt-4">
                                                            <div className="col-md-12">
                                                                <HighchartsReact
                                                                    highcharts={Highcharts}
                                                                    options={{

                                                                        chart: {
                                                                            type: 'column'
                                                                        },

                                                                        xAxis: {
                                                                            categories: ['Govt.', 'Aided', 'Private', 'Other', 'Total']
                                                                        },

                                                                        yAxis: {
                                                                            allowDecimals: false,
                                                                            min: 0,
                                                                            title: {
                                                                                text: ''
                                                                            }
                                                                        },

                                                                        tooltip: {
                                                                            format: '<b>{key}</b><br/>{series.name}: {y}<br/>' +
                                                                                'Total: {point.stackTotal}'
                                                                        },

                                                                        plotOptions: {
                                                                            column: {
                                                                                stacking: 'normal'
                                                                            }
                                                                        },

                                                                        legend: {
                                                                            layout: 'vertical',
                                                                            align: 'right',
                                                                            verticalAlign: 'middle',
                                                                            itemMarginTop: 10,
                                                                            itemMarginBottom: 10
                                                                        },
                                                                        credits: {
                                                                            enabled: false
                                                                        },
                                                                        series: [{
                                                                            name: 'Not Available',
                                                                            data: [4, 9, 2, 15, 3],
                                                                            color: "#E6694A"

                                                                        }, {
                                                                            name: 'Available',
                                                                            data: [96, 91, 98, 85, 97],
                                                                            color: "#BCE263"
                                                                        }]
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
