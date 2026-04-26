/**
 * 数据存储，同时支持本地和网络存储，暂时不用
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

    var getLoginToken = function () {
        var profile = layui.data('profile');
        if (profile && profile.logintoken) {
            return profile.logintoken;
        } else {
            return null;
        }
    };

    // 检查网络连接状态
    var isOnline = function () {
        return navigator.onLine;
    };

    // 生成唯一ID
    var generateUUID = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    // 本地存储操作
    var localStore = {
        // 获取本地存储的所有数据
        getAll: function () {
            var localData = layui.data('bazi_local_data');
            return localData.items || [];
        },

        // 保存数据到本地存储
        saveAll: function (items) {
            layui.data('bazi_local_data', {
                key: 'items',
                value: items
            });

            // 记录待同步的操作
            layui.data('bazi_sync_queue', {
                key: 'needSync',
                value: true
            });
        },

        // 添加一条数据
        add: function (item) {
            if (!item.id) {
                item.id = generateUUID();
            }
            var items = this.getAll();
            items.push(item);
            this.saveAll(items);
            return item;
        },

        // 更新一条数据
        update: function (item) {
            var items = this.getAll();
            for (var i = 0; i < items.length; i++) {
                if (items[i].id === item.id) {
                    items[i] = item;
                    this.saveAll(items);
                    return item;
                }
            }
            return null;
        },

        // 删除一条数据
        remove: function (id) {
            var items = this.getAll();
            for (var i = 0; i < items.length; i++) {
                if (items[i].id === id) {
                    items.splice(i, 1);
                    this.saveAll(items);
                    return true;
                }
            }
            return false;
        },

        // 根据ID获取一条数据
        getById: function (id) {
            var items = this.getAll();
            for (var i = 0; i < items.length; i++) {
                if (items[i].id === id) {
                    return items[i];
                }
            }
            return null;
        },

        // 根据条件查询数据
        query: function (criteria) {
            var items = this.getAll();
            if (!criteria || Object.keys(criteria).length === 0) {
                return items;
            }

            return items.filter(function (item) {
                for (var key in criteria) {
                    if (criteria[key] && item[key] !== criteria[key]) {
                        return false;
                    }
                }
                return true;
            });
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
        request: function (requestUrl, data, okHandler, failHandler) {
            // 检查网络状态
            if (!isOnline()) {
                failHandler && failHandler({ code: "503", message: "网络连接不可用，已切换到本地存储模式", data: null });
                return;
            }

            var logintoken = getLoginToken();
            if (!logintoken) {
                failHandler && failHandler({ code: "401", message: "您未登录，请先登录!", data: null });
                return;
            }
            $.ajax({
                url: requestUrl,
                headers: {
                    "Authorization": "Bearer " + logintoken
                },
                data: data,
                success: function (result) {
                    if (!result) {
                        failHandler && failHandler({ code: "500", message: "服务器未响应", data: null });
                    }
                    if (result.code == "200") {
                        okHandler && okHandler(result);
                    } else {
                        failHandler && failHandler(result);
                    }
                },
                error: function (result) {
                    console.log(result.message);
                    failHandler && failHandler({ code: "500", message: "服务器错误!", data: null });
                }
            });
        },

        /**
         * 添加数据
         * @param {*} data 
         * @param {*} okHandler 
         * @param {*} failHandler 
         */
        add: function (data, okHandler, failHandler) {
            if (isOnline()) {
                var actionurl = "bz/add";
                this.request(actionurl, data, okHandler, function (error) {
                    // 网络请求失败，尝试本地存储
                    console.log("网络请求失败，使用本地存储");
                    try {
                        var result = localStore.add(data);
                        okHandler && okHandler({ code: "200", message: "已保存到本地", data: result });
                    } catch (e) {
                        failHandler && failHandler({ code: "500", message: "本地存储失败: " + e.message, data: null });
                    }
                });
            } else {
                // 离线模式，直接使用本地存储
                try {
                    var result = localStore.add(data);
                    okHandler && okHandler({ code: "200", message: "已保存到本地", data: result });
                } catch (e) {
                    failHandler && failHandler({ code: "500", message: "本地存储失败: " + e.message, data: null });
                }
            }
        },

        /**
         * 读取数据
         * @param {*} data 
         * @param {*} okHandler 
         * @param {*} failHandler 
         */
        read: function (data, okHandler, failHandler) {
            if (isOnline()) {
                var actionurl = "bz/get";
                this.request(actionurl, data, okHandler, function (error) {
                    // 网络请求失败，尝试本地读取
                    console.log("网络请求失败，从本地读取");
                    try {
                        var result = localStore.getById(data.id);
                        if (result) {
                            okHandler && okHandler({ code: "200", message: "从本地读取成功", data: result });
                        } else {
                            failHandler && failHandler({ code: "404", message: "本地未找到数据", data: null });
                        }
                    } catch (e) {
                        failHandler && failHandler({ code: "500", message: "本地读取失败: " + e.message, data: null });
                    }
                });
            } else {
                // 离线模式，直接从本地读取
                try {
                    var result = localStore.getById(data.id);
                    if (result) {
                        okHandler && okHandler({ code: "200", message: "从本地读取成功", data: result });
                    } else {
                        failHandler && failHandler({ code: "404", message: "本地未找到数据", data: null });
                    }
                } catch (e) {
                    failHandler && failHandler({ code: "500", message: "本地读取失败: " + e.message, data: null });
                }
            }
        },

        /**
         * 更新数据
         * @param {*} data 
         * @param {*} okHandler 
         * @param {*} failHandler 
         */
        update: function (data, okHandler, failHandler) {
            if (isOnline()) {
                var actionurl = "bz/update";
                this.request(actionurl, data, okHandler, function (error) {
                    // 网络请求失败，尝试本地更新
                    console.log("网络请求失败，更新本地数据");
                    try {
                        var result = localStore.update(data);
                        if (result) {
                            okHandler && okHandler({ code: "200", message: "本地更新成功", data: result });
                        } else {
                            failHandler && failHandler({ code: "404", message: "本地未找到要更新的数据", data: null });
                        }
                    } catch (e) {
                        failHandler && failHandler({ code: "500", message: "本地更新失败: " + e.message, data: null });
                    }
                });
            } else {
                // 离线模式，直接更新本地
                try {
                    var result = localStore.update(data);
                    if (result) {
                        okHandler && okHandler({ code: "200", message: "本地更新成功", data: result });
                    } else {
                        failHandler && failHandler({ code: "404", message: "本地未找到要更新的数据", data: null });
                    }
                } catch (e) {
                    failHandler && failHandler({ code: "500", message: "本地更新失败: " + e.message, data: null });
                }
            }
        },

        /**
         * 删除数据
         * @param {*} data 指定data.id信息
         * @param {*} okHandler 
         * @param {*} failHandler 
         */
        remove: function (data, okHandler, failHandler) {
            if (isOnline()) {
                var actionurl = "bz/delete";
                this.request(actionurl, data, okHandler, function (error) {
                    // 网络请求失败，尝试本地删除
                    console.log("网络请求失败，从本地删除");
                    try {
                        var result = localStore.remove(data.id);
                        if (result) {
                            okHandler && okHandler({ code: "200", message: "本地删除成功", data: null });
                        } else {
                            failHandler && failHandler({ code: "404", message: "本地未找到要删除的数据", data: null });
                        }
                    } catch (e) {
                        failHandler && failHandler({ code: "500", message: "本地删除失败: " + e.message, data: null });
                    }
                });
            } else {
                // 离线模式，直接从本地删除
                try {
                    var result = localStore.remove(data.id);
                    if (result) {
                        okHandler && okHandler({ code: "200", message: "本地删除成功", data: null });
                    } else {
                        failHandler && failHandler({ code: "404", message: "本地未找到要删除的数据", data: null });
                    }
                } catch (e) {
                    failHandler && failHandler({ code: "500", message: "本地删除失败: " + e.message, data: null });
                }
            }
        },

        /**
         * 查询数据
         * @param {*} data 指定data.name信息
         * @param {*} okHandler 
         * @param {*} failHandler 
         */
        browse: function (data, okHandler, failHandler) {
            if (isOnline()) {
                var actionurl = "bz/select";
                this.request(actionurl, data, okHandler, function (error) {
                    // 网络请求失败，尝试本地查询
                    console.log("网络请求失败，从本地查询");
                    try {
                        var results = localStore.query(data);
                        okHandler && okHandler({ code: "200", message: "本地查询成功", data: results });
                    } catch (e) {
                        failHandler && failHandler({ code: "500", message: "本地查询失败: " + e.message, data: null });
                    }
                });
            } else {
                // 离线模式，直接从本地查询
                try {
                    var results = localStore.query(data);
                    okHandler && okHandler({ code: "200", message: "本地查询成功", data: results });
                } catch (e) {
                    failHandler && failHandler({ code: "500", message: "本地查询失败: " + e.message, data: null });
                }
            }
        },

        /**
         * 同步本地数据到服务器
         * @param {*} okHandler 
         * @param {*} failHandler 
         */
        syncToServer: function (okHandler, failHandler) {
            if (!isOnline()) {
                failHandler && failHandler({ code: "503", message: "网络连接不可用，无法同步", data: null });
                return;
            }

            var syncData = layui.data('bazi_sync_queue');
            if (!syncData || !syncData.needSync) {
                okHandler && okHandler({ code: "200", message: "没有需要同步的数据", data: null });
                return;
            }

            var localData = localStore.getAll();
            if (!localData || localData.length === 0) {
                okHandler && okHandler({ code: "200", message: "没有本地数据需要同步", data: null });
                return;
            }

            // 这里实现批量同步逻辑
            // 实际应用中可能需要更复杂的同步策略，比如记录每个操作的类型（增删改）
            var actionurl = "bz/batchSync";
            this.request(actionurl, { items: localData }, function (result) {
                // 同步成功后清除同步标记
                layui.data('bazi_sync_queue', {
                    key: 'needSync',
                    value: false
                });
                okHandler && okHandler(result);
            }, failHandler);
        },

        /**
         * 检查是否有未同步的本地数据
         * @returns {boolean} 是否有未同步数据
         */
        hasUnsyncedData: function () {
            var syncData = layui.data('bazi_sync_queue');
            return syncData && syncData.needSync;
        },

        /**
         * 清除本地数据
         * @param {*} okHandler 
         * @param {*} failHandler 
         */
        clearLocalData: function (okHandler, failHandler) {
            try {
                layui.data('bazi_local_data', null);
                layui.data('bazi_sync_queue', null);
                okHandler && okHandler({ code: "200", message: "本地数据已清除", data: null });
            } catch (e) {
                failHandler && failHandler({ code: "500", message: "清除本地数据失败: " + e.message, data: null });
            }
        }
    };

    //输出 dataservice 接口
    exports('dataservice2', dataServiceObj);
})