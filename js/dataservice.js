/*
 * 吉时雨 (JiShiYu)
 * Copyright (C) 2026 xianbo.chen@gmail.com
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the LICENSE file for more details.
 *
 * If you use this software to provide network services (e.g. SaaS, API),
 * you must make your source code available to users.
 *
 * Commercial licensing is available:
 * 📧 xianbo.chen@gmail.com
 */

/**
 * 数据存储服务。需要后端服务支持。
 * @author xianbo.chen@gmail.com
 */

/**
 * 表结构：
 * {
 *  "id": "xxxxxxxx",
 *  "uid": "yyyyyy",
 *  "name": "xxx",
 *  "sex": true,
 *  "diqu1": "湖北",
 *  "diqu2": "武汉",
 *  "realsun": true,
 *  "zhaowanzishi": true,
 *  "nldatetime": "",
 *  "gldatetime": "",
 *  "animal": "",
 *  "bazi": "",
 *  "tag": []
 * }
 */
layui.define(function (exports) {

  var getLoginToken = function() {
    var profile = layui.data('profile');
    if( profile && profile.logintoken ){
      return profile.logintoken;
    }else{
      return null;
    }
  };

  var dataServiceObj = {

    /**
     * 请求服务器。
     * @param {string} requestUrl 请求地址url
     * @param {JSON} data 要发送的数据
     * @param {function} okHandler 成功回调函数
     * @param {function} failHandler 失败回调函数
     */
    request : function (requestUrl, data, okHandler, failHandler, method) {
      var logintoken = getLoginToken();
      if( !logintoken ){
        failHandler&&failHandler({code:"401",message:"您未登录，请先登录!",data:null});
        return;
      }
      $.ajax({
        url: requestUrl,
        type: method || "GET",
        headers: {
          "Authorization": "Bearer " + logintoken
        },
        data: data,
        success: function(result){
          if( !result ){
            failHandler&&failHandler({code:"500",message:"服务器未响应",data:null});
          }
          if( result.code=="200" ){
            okHandler&&okHandler(result);
          }else{
            failHandler&&failHandler(result);
          }
        },
        error: function(result){
          console.log(result.message);
          failHandler&&failHandler({code:"500",message:"服务器错误!",data:null});
        }
      });
    }
    ,
    /**
     * 添加数据
     * @param {*} data 
     * @param {*} okHandler 
     * @param {*} failHandler 
     */
    add: function (data, okHandler, failHandler) {
      var actionurl = "bz/add";
      this.request(actionurl, data, okHandler, failHandler);
    }
    ,
    /**
     * 读取数据
     * @param {*} data 
     * @param {*} okHandler 
     * @param {*} failHandler 
     */
    read: function (data, okHandler, failHandler) {
      var actionurl = "bz/get";
      this.request(actionurl, data, okHandler, failHandler);
    }
    ,
    /**
     * 更新数据
     * @param {*} data 
     * @param {*} okHandler 
     * @param {*} failHandler 
     */
    update: function (data, okHandler, failHandler) {
      var actionurl = "bz/update";
      this.request(actionurl, data, okHandler, failHandler);
    }
    ,
    /**
     * 删除数据
     * @param {*} data 指定data.id信息
     * @param {*} okHandler 
     * @param {*} failHandler 
     */
    remove: function (data,okHandler, failHandler) {
      var actionurl = "bz/delete";
      this.request(actionurl, data, okHandler, failHandler);
    }
    ,
    /**
     * 查询数据
     * @param {*} data 指定data.name信息
     * @param {*} okHandler 
     * @param {*} failHandler 
     */
    browse: function(data, okHandler, failHandler){
      var actionurl = "bz/select";
      this.request(actionurl, data, okHandler, failHandler);
    }

  }

  //输出 dataservice 接口
  exports('dataservice', dataServiceObj);
})
