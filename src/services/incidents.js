import axios from "axios";
import moment from "moment";
import config from "../configs/appConfig";
//Return promise that will return array of incidents order by date desc
export function getIncidents( startDate, endDate, state = null, lang = 'en', showSelfReportIncidents = false, skip_cache = false ) {
    const type = showSelfReportIncidents ? "both" : "news";
    const params = new URLSearchParams({
        start: moment(startDate).format("YYYY-MM-DD"),
        end: moment(endDate).format("YYYY-MM-DD"),
        type,
        lang,
        ...(state ? { state } : {}),
        ...(skip_cache ? { skip_cache: "true" } : {}),
        ...(showSelfReportIncidents ? { self_report_status: "approved" } : {})
      });
    
    const incidentsAPIUrl = `${config.api_endpoint}/incidents?${params.toString()}`;
    return axios.get(incidentsAPIUrl,
        {
            headers: {
                "Access-Control-Allow-Origin": "false",
                "strict-origin-when-cross-origin": "false"
            }
        }).then((response) => {
        return response.data.incidents;
    });
}

export function getStats( startDate, endDate, state = null, showSelfReportIncidents = false) {
    const type = showSelfReportIncidents ? "both" : "news";
    const params = new URLSearchParams({
        start: moment(startDate).format("YYYY-MM-DD"),
        end: moment(endDate).format("YYYY-MM-DD"),
        type,
        ...(state ? { state } : {}),
        ...(showSelfReportIncidents ? { self_report_status: "approved" } : {})
    });
    const statsAPIUrl = `${config.api_endpoint}/stats?${params.toString()}`;
    return axios.get(statsAPIUrl,
        {
            headers: {
                "Access-Control-Allow-Origin": "false",
                "strict-origin-when-cross-origin": "false"
            }
        }).then((response) => {
        return response.data;
    });
}
export function upsertIncident(incident) {
    const incidentAPIUrl = config.api_endpoint + "/incidents";
    if ( !incident.incident_source ){
        incident.incident_source = "MANUAL";
    }
    return axios.post(incidentAPIUrl, {incident:incident},
        {
            headers: {
                "Access-Control-Allow-Origin": "false",
                "strict-origin-when-cross-origin": "false"
            }
        }).then((response) => { return response.incident_id; });
}
export function createIncident(incident) {
    return upsertIncident(incident);
}

export function deleteIncident(id) {
    const incidentAPIUrl = `${config.api_endpoint}/incidents/${id}`;
    return axios.delete(incidentAPIUrl, 
        {
            headers: {
                "Access-Control-Allow-Origin": "false",
                "strict-origin-when-cross-origin": "false"
            }
        }).then((response) => { return response.data; });
}