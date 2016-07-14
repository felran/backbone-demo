/**
 * Created by luor on 2015/10/30.
 */
define("common",['jquery'],function($){
    var common = {
        proto : "http://",
        ip : "localhost:",
        port : "8080/",
        mockDateUrl : "../mockData/"
    };
//    var urlHeader = common.proto+common.ip+common.port+common.system;
    var urlHeader = "api/";
    var restapi = {
    };
    var mockData = {
        _get_menus: "mockData/nav.json",
        _get_users: "mockData/users.json",
        _get_plan:"mockData/data.json"
    };

    return {
        restapi:restapi,
        mockData:mockData,
        urlHeader:urlHeader
    };
});