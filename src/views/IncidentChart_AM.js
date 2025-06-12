// import { ThemeColors } from "@src/utility/context/ThemeColors";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { Card, CardBody, CardHeader, CardTitle } from "reactstrap";
import React, { useEffect, useLayoutEffect, useState, useContext } from "react";
import { stateFullName } from "../utility/Utils";
import { useTranslation } from "react-i18next";
import { Trans } from "react-i18next";
import "./IncidentChart_AM.css"; 
import { th } from "date-fns/locale";

am4core.useTheme(am4themes_animated);

/*
Example comes from here
https://www.amcharts.com/docs/v4/getting-started/integrations/using-react/
*/

//chartData is result from ___
const IncidentChart_AM = ({ color, chart_data, state, isFirstLoadData, viewMode = 'daily', onViewModeChange }) => {
  const { t } = useTranslation();
  const [totalCases, setTotalCases] = useState(0);

  useLayoutEffect(() => {
    let total = 0;
    for (let i = 0; i < chart_data.length; i++) {
      total += chart_data[i].value;
    }
    setTotalCases(total);

    // Create chart instance
    let chart = am4core.create("chart_1yaxis", am4charts.XYChart);
    chart.data = chart_data;
    // Create date axes and value axes
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.stroke = "white";
    dateAxis.renderer.grid.template.strokeWidth = 1;
    dateAxis.renderer.grid.template.strokeOpacity = 0.2;
    dateAxis.renderer.grid.template.strokeDasharray = "3,3";
    dateAxis.renderer.grid.template.location = 0.5;
    dateAxis.dateFormats.setKey("day", "MM/yyyy");
    dateAxis.periodChangeDateFormats.setKey("day", "MM/yyyy");
    dateAxis.dateFormats.setKey("week", "MM/yyyy");
    dateAxis.periodChangeDateFormats.setKey("week", "MM/yyyy");
    dateAxis.dateFormats.setKey("month", "MM/yyyy");
    dateAxis.periodChangeDateFormats.setKey("month", "MM/yyyy");
    dateAxis.renderer.minGridDistance = 70;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "Case Count";
    valueAxis.min = 0;
    valueAxis.title.fontWeight = 600;
    valueAxis.renderer.grid.template.stroke = "white";
    valueAxis.renderer.grid.template.strokeWidth = 1;
    valueAxis.renderer.grid.template.strokeOpacity = 0.2;
    valueAxis.renderer.grid.template.strokeDasharray = "3,3";

    // Setting up toolTipText
    // let toolTipText = `{key}
    //     [bold]Monthly Cases: {monthly_cases}
    //     [bold]Daily Cases: {value}`;
    
    // Monthly mode – stacked bars: News (gray) + Self-report (yellow)
    const newsSeries = chart.series.push(new am4charts.ColumnSeries());
    newsSeries.dataFields.valueY = "news";
    newsSeries.dataFields.dateX = "key";
    newsSeries.name = "News Reports";
    newsSeries.fill = am4core.color("#b0b0b0");
    newsSeries.stroke = am4core.color("#b0b0b0");
    newsSeries.columns.template.width = am4core.percent(50);
    newsSeries.stacked = true;
    newsSeries.hidden = viewMode === 'daily';
    const selfReportSeries = chart.series.push(new am4charts.ColumnSeries());
    selfReportSeries.dataFields.valueY = "self_report";
    selfReportSeries.dataFields.dateX = "key";
    selfReportSeries.name = "Self-reported";
    selfReportSeries.fill = am4core.color("#cc804d");
    selfReportSeries.stroke = am4core.color("#cc804d");
    selfReportSeries.columns.template.width = am4core.percent(50);
    selfReportSeries.stacked = true;
    selfReportSeries.hidden = viewMode === 'daily';

    // Daily: News Reports
    const dailyNewsSeries = chart.series.push(new am4charts.ColumnSeries());
    dailyNewsSeries.dataFields.valueY = "daily_news";
    dailyNewsSeries.dataFields.dateX = "key";
    dailyNewsSeries.name = "News Reports";
    dailyNewsSeries.fill = am4core.color("#FEF753");
    dailyNewsSeries.stroke = am4core.color("#FEF753");
    dailyNewsSeries.columns.template.tooltipText = `{key}
    [bold]News Reports: {daily_news}`;
    dailyNewsSeries.columns.template.width = am4core.percent(80);
    dailyNewsSeries.stacked = true;
    dailyNewsSeries.hidden = viewMode === 'monthly';

    // Daily: Self-reported
    const dailySelfReportSeries = chart.series.push(new am4charts.ColumnSeries());
    dailySelfReportSeries.dataFields.valueY = "daily_self_report";
    dailySelfReportSeries.dataFields.dateX = "key";
    dailySelfReportSeries.name = "Self-reported";
    dailySelfReportSeries.fill = am4core.color("#cc804d");
    dailySelfReportSeries.stroke = am4core.color("#cc804d");
    dailySelfReportSeries.columns.template.tooltipText = `{key}
    [bold]Self-reported: {daily_self_report}`;
    dailySelfReportSeries.columns.template.width = am4core.percent(80);
    dailySelfReportSeries.stacked = true;
    dailySelfReportSeries.hidden = viewMode === 'monthly';


    // chart cursor on
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.lineX.disabled = false;
    chart.cursor.lineY.disabled = false;

    return () => {
      chart.dispose();
    };
  }, [chart_data, viewMode]);

  return (
    <div>
      <Card>
        <CardHeader>
          <div>
            <CardTitle tag="h4">
              {t("incident_chart.trend")}&nbsp;-&nbsp;
              {totalCases > 0
                ? t("incident_chart.total_cases", { count: totalCases })
                : t("incident_chart.no_data")}
              {state ? " : " + stateFullName(state) : ""}
            </CardTitle>
          </div>
        </CardHeader>
        <CardBody>
          <div className="recharts-wrapper">
            {totalCases === 0 && !isFirstLoadData ? (
              <>
                <p className="add-data-button">
                  <Trans i18nKey="no_data_please_report">
                    There is no data collected in the selected location and date
                    range yet. Please click
                    <a
                      href="https://forms.gle/HRkVKW2Sfp7BytXj8"
                      target="_blank"
                    >
                      here
                    </a>
                    to report incidents to us.
                  </Trans>
                </p>
                <div className="drop-down" />
              </>
            ) : null}
            <div
              id="chart_1yaxis"
              style={{ width: "100%", height: "400px" }}
            ></div>
          </div>
          <div className="time-range-toggle">
            <div
              className="time-option"
              onClick={() => onViewModeChange("monthly")}
            >
              <div className={`time-circle-outer ${viewMode === "monthly" ? "active" : ""}`}>
                {viewMode === "monthly" && <div className="time-circle-inner" />}
              </div>
              <span className={viewMode === "monthly" ? "active-label" : "inactive-label"}>
                Monthly
              </span>
            </div>
            <div
              className="time-option"
              onClick={() => onViewModeChange("daily")}
            >
              <div className={`time-circle-outer ${viewMode === "daily" ? "active" : ""}`}>
                {viewMode === "daily" && <div className="time-circle-inner" />}
              </div>
              <span className={viewMode === "daily" ? "active-label" : "inactive-label"}>
                Daily
              </span>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default IncidentChart_AM;
