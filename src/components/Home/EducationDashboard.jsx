import React, { useEffect, useState } from 'react';
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
import {useTranslation} from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData } from '../../redux/thunks/dashboardThunk';
import { convertToIndianNumberSystem } from '../../constants/constants';
import Breadcrumb from './Breadcrumb';
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/accessibility')(Highcharts);
require("highcharts/modules/export-data.js")(Highcharts);


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
    const dispatch = useDispatch();
    const schoolFilter = useSelector((state) => state.schoolFilter);
    const filterObj = structuredClone(schoolFilter);

    
    useEffect(() => {
        
        dispatch(fetchDashboardData(filterObj));
    }, [dispatch,schoolFilter]);

    const dashData=useSelector((state)=>state?.dashboard?.data?.data?.[0]) || {}; 
 console.log("dashData",dashData)


    const totalTeachers=(dashData?.totTeachersMale + dashData?.totTeachersFemale) || 0;
    const totalStudents=(dashData?.totStudentBoys + dashData?.totStudentGirls) || 0;
    
    const { t } = useTranslation();
    return (
        <>
            <section className="pgicategory vision-mission-card ptb-30">
                <div className="container">
                    <div className="row">
                    <div className="col-md-12 mb-4 p-0">
                            <h2 className="heading-blue">{t("education_dashboard")}</h2>
                            <Breadcrumb/>
                        </div>
                        
                        <div className="col-md-12 col-lg-12 p-0">
                            <div className="common-content text-start right-card-sec">
                                <div className="srid-card-se">
                                    <div className="row">
                                        <div className="col-md-4 col-lg-4">
                                            <div className="card-box">
                                                <img src={school} alt="school" className='card-img' />
                                                <i className="sub-text-c text-green">{t("no_of_schools")}</i>
                                                <div className="main-text-c m-big">{dashData?.totSchools || 0}</div>

                                                <span className="sub-text-c">{t("urban")}</span>
                                                <div className="main-text-c">{convertToIndianNumberSystem((dashData?.totSchoolsUrban) || 0)}</div>

                                                <span className="sub-text-c">{t("rural")}</span>
                                                <div className="main-text-c">{convertToIndianNumberSystem((dashData?.totSchoolsRural) || 0)}</div>
                                            </div>
                                        </div>
                                        <div className="col-md-4 col-lg-4">
                                            <div className="card-box">
                                                <img src={Teachers} alt="Teachers" className='card-img' />
                                                <i className="sub-text-c text-green">{t("no_of_teachers")}</i>
                                                <div className="main-text-c m-big">{totalTeachers}</div>

                                                <span className="sub-text-c">{t("Male")}</span>
                                                <div className="main-text-c">{convertToIndianNumberSystem((dashData?.totTeachersMale)|| 0)}</div>

                                                <span className="sub-text-c">{t("Female")}</span>
                                                <div className="main-text-c">{convertToIndianNumberSystem((dashData?.totTeachersFemale)|| 0)}</div>
                                            </div>
                                        </div>
                                        <div className="col-md-4 col-lg-4">
                                            <div className="card-box">
                                                <img src={Students} alt="Students" className='card-img' />
                                                <i className="sub-text-c text-green">{t("no_of_students")}</i>
                                                <div className="main-text-c m-big">{totalStudents}</div>

                                                <span className="sub-text-c">{t("Boys")}</span>
                                                <div className="main-text-c">{convertToIndianNumberSystem((dashData?.totStudentBoys) || 0)}</div>

                                                <span className="sub-text-c">{t("Girls")}</span>
                                                <div className="main-text-c">{convertToIndianNumberSystem((dashData?.totStudentGirls) || 0)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-box-impact mt-4">
                                    <div className="row">
                                        <div className="col-md-12 mb-4">
                                            <h2 className="heading-sm">{t("impact_of_various_schemes_and_initiatives")}</h2>
                                        </div>


                                        <div className="col-md-4 col-lg-4">
                                            <div className="impact-box-content">
                                                <img src={ArrowUP} alt="school" className='card-img-impact' />
                                                <div className="main-text-c m-big" style={{ whiteSpace: 'pre-line' }}>{t("gross_enrollment_ratio")}</div>

                                                <div className="main-text-c">{t("elementary")}</div>
                                                <span className="sub-text-c">100.13%</span>

                                                <div className="main-text-c">{t("secondary")}</div>
                                                <span className="sub-text-c">79.86%</span>
                                            </div>
                                        </div>

                                        <div className="col-md-4 col-lg-4">
                                            <div className="impact-box-content">
                                                <img src={Arrowdown} alt="school" className='card-img-impact' />
                                                <div className="main-text-c m-big" style={{ whiteSpace: 'pre-line' }}>{t("dropout_rate")}</div>

                                                <div className="main-text-c">{t("primary")}</div>
                                                <span className="sub-text-c">{dashData?.dropoutRatePry || 0}%</span>

                                                <div className="main-text-c">{t("secondary")}</div>
                                                <span className="sub-text-c">{dashData?.dropoutRateSec || 0}%</span>
                                            </div>
                                        </div>

                                        <div className="col-md-4 col-lg-4">
                                            <div className="impact-box-content">
                                                <img src={transition_img} alt="school" className='card-img-impact' />
                                               
                                                <div className="main-text-c m-big" style={{ whiteSpace: 'pre-line' }}>{t("transition_rate")}</div>

                                                <div className="main-text-c">{t("primary_to_upper_primary")}</div>
                                                <span className="sub-text-c">{dashData?.transitionRatePryToUpr || 0}%</span>

                                                <div className="main-text-c">{t("upper_primary_to_secondary")}</div>
                                                <span className="sub-text-c">{dashData?.transitionRateUprToSec || 0}%</span>
                                            </div>
                                        </div>

                                        <div className="col-md-4 col-lg-4">
                                            <div className="impact-box-content">
                                            <div className="img-multi-box">
                                                <img src={std1} alt="school" />
                                                <img src={std2} alt="school" className='big-img'/>
                                                <img src={std1} alt="school" />
                                                </div>
                                                <div className="main-text-c m-big" style={{ whiteSpace: 'pre-line' }}>{t("pupil_teacher_ratio")}</div>

                                                <div className="main-text-c">{t("primary")}</div>
                                                <span className="sub-text-c">100.13%</span>
 
                                                <div className="main-text-c">{t("upper_primary")}</div>
                                                <span className="sub-text-c">79.86%</span>
                                            </div>
                                        </div>

                                        <div className="col-md-4 col-lg-4">
                                            <div className="impact-box-content">
                                                <img src={drinkinwater} alt="school" className='card-img-impact' />
                                                <div className="main-text-c m-big" style={{ whiteSpace: 'pre-line' }}>{t("schools_with_drinking_water")}</div>

                                                <span className="sub-text-c sub-main-text">97.6%</span>
                                            </div>
                                        </div>

                                        <div className="col-md-4 col-lg-4">
                                            <div className="impact-box-content">
                                                <img src={power} alt="school" className='card-img-impact' />
                                                <div className="main-text-c m-big" style={{ whiteSpace: 'pre-line' }}>{t("schools_with_electricity_connection")}</div>
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
                                                    <h2 className="heading-sm">{t("education_data_by_management_type")}</h2>
                                                    <div className='d-flex w-20'>
                                                        <button className='view-table-btn'> <span className="material-icons-round">table_view</span> View Table </button>
                                                        <button className='view-table-btn view-more-btn ms-1'> <span className="material-icons-round me-0">more_horiz</span></button>
                                                    </div>
                                                </div>

                                                <Tabs defaultActiveKey="School" id="uncontrolled-tab-example" className="">

                                                    <Tab eventKey="School" title={t("school")}>

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
                                                                            text: 'Education Data By Management Type'
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
                                                                                    enabled: false,
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
                                                    <Tab eventKey="Teacher" title={t("teacher")}>
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
                                                                            text: 'Education Data By Management Type'
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
                                                                                    enabled: false,
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
                                                    <Tab eventKey="Student" title={t("student")}>
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
                                                                            text: 'Education Data By Management Type'
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
                                                                                    enabled: false,
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
                                                    <h2 className="heading-sm">{t("enrollment_by_level_of_education_gender")}</h2>
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
                                                                    categories: ['Higher-Secondary', 'Secondary', 'Upper Primary', 'Primary', 'Pre-Primary'],
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
                                                                title: {
                                                                    text: 'Enrollement By Level Of Education & Gender'
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
                                                    <h2 className="heading-sm" style={{ whiteSpace: 'pre-line' }}>{t("status_of_infrastructure_in_schools")}</h2>
                                                    <div className='d-flex w-20'>
                                                        <button className='view-table-btn'> <span className="material-icons-round">table_view</span> View Table </button>
                                                        <button className='view-table-btn view-more-btn ms-1'> <span className="material-icons-round me-0">more_horiz</span></button>
                                                    </div>
                                                </div>

                                                <Tabs defaultActiveKey="Girl Toilet" id="uncontrolled-tab-example" className="">

                                                    <Tab eventKey="Girl Toilet" title={t("girl_toilet")}>
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
                                                                        title: {
                                                                            text: 'Status of Infrastructure in Schools (Management Wise)'
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
                                                    <Tab eventKey="Library" title={t("library")}>
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
                                                                        title: {
                                                                            text: 'Status of Infrastructure in Schools (Management Wise)'
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
                                                    <Tab eventKey="Library With Books" title={t("library_with_books")}>
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
                                                                        title: {
                                                                            text: 'Status of Infrastructure in Schools (Management Wise)'
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
                                                    <Tab eventKey="Electricity" title={t("electricity")}>
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
                                                                        title: {
                                                                            text: 'Status of Infrastructure in Schools (Management Wise)'
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
                                                    <Tab eventKey="Drinking Water" title={t("drinking_water")}>
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
                                                                        title: {
                                                                            text: 'Status of Infrastructure in Schools (Management Wise)'
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
                                                    <Tab eventKey="Handwash" title={t("handwash")}>
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
                                                                        title: {
                                                                            text: 'Status of Infrastructure in Schools (Management Wise)'
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
                                                    <Tab eventKey="Medical Facility" title={t("medical_facility")}>
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
                                                                        title: {
                                                                            text: 'Status of Infrastructure in Schools (Management Wise)'
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
