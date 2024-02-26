import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Reports from '../components/Report/Reports';
import AllReport from '../pages/AllReport';
import SchoolReport from '../components/Report/SchoolReport';
import TeacherReport from '../components/Report/TeacherReport';
import Infrastructure3013 from '../components/Report/InfrastructureReport3013';
import ScreenReader from '../pages/ScreenReader';
import HelpLineNumber from "../pages/HelpLineNumber";

export const routes = (
    <Routes>
                  
                    <Route exact path="/" element={<Home />} />
                    <Route exact path="/reports" element={<Reports />} />
                    <Route exact path="/all-reports" element={<AllReport />} />
                    <Route exact path="/school-reports" element={<SchoolReport />} />
                    <Route exact path="/teacher-reports" element={<TeacherReport />} />
                    <Route exact path="/infrastructure-reports3013" element={<Infrastructure3013 />} />
                    <Route exact path="/screen-reader-access" element={<ScreenReader />} />
                    <Route exact path="/help-line-numbers" element={<HelpLineNumber />} />
                    <Route path="/*" element={<Navigate to="/" />} />
                </Routes>
)