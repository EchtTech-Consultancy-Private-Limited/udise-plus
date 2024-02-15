import React from 'react';
import Mapimage from '../../assets/images/ind_map.svg'

export default function HomeMap({handleClass}) {

    const handleChangeClass=(class_value)=>{
        handleClass(class_value);
    }
    return (
        <>
            <section className="map-main-card ptb-30">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 p-0">
                            <div className="common-content text-start map-heading-map">
                                <h2 className="heading-blue mb-3">Welcome to UDISE+ <br/> Dashboard</h2>
                                <button className="header-dropdown-btn close-map-btn" title="Close Map" onClick={()=>handleChangeClass('close_map_sec')}> <span className="material-icons-round">close</span> Close Map</button>
                            </div>
                        </div>
                        <div className="col-md-10">
                            <div className="common-content text-start map-heading-map">
                                <div className="mapindia">
                                    <img src={Mapimage} alt="India Map" />
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    )
}
