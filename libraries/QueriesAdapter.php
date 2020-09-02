<?php

namespace app\libraries;


class QueriesAdapter
{
    /**
     * @param string $url
     * @return string
     */
    public static function sendQuery(string $url = 'http://nazone.mobi/'): string
    {

        if ($_SERVER["REQUEST_URI"]) {
            $url .= $_SERVER["REQUEST_URI"];
        }
        $headers = [
            "Cache-Control: no-cache",
            "Cookie: __utmc=91059205; __utmz=91059205.1597402233.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); remember_token2=3193132; browser_id=aacfe95051635a199a36b6b57b64a090; js_use=1; screen_height=952; screen_width=800; remember_token=ff9fe575e6960178bee43da5fdf531c3; __utma=91059205.533593149.1597402233.1598965541.1598965545.24; __utmb=91059205.63.10.1598965545; _session_id=b6ac2c8fa0ec72784564dc5387cdb08e"
        ];

        $cr = curl_init();
        curl_setopt($cr, CURLOPT_URL, $url);
        curl_setopt($cr, CURLOPT_CONNECTTIMEOUT, 100);
        curl_setopt($cr, CURLOPT_TIMEOUT, 100);
        curl_setopt($cr, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($cr, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($cr, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($cr, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($cr, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($cr, CURLINFO_HEADER_OUT, 1);

        $result = curl_exec($cr);
        $error = curl_error($cr);
        curl_close($cr);

        return $result;
    }
}