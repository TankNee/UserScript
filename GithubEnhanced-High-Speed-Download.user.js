// ==UserScript==
// @name         Github 增强 - 高速下载
// @version      1.5.1
// @author       X.I.U
// @description  高速下载 Git Clone/SSH、Release、Raw、Code(ZIP) 等文件、项目列表单文件快捷下载 (☁)
// @match        *://github.com/*
// @match        *://hub.fastgit.org/*
// @icon         https://i.loli.net/2021/03/30/ULV9XunaHesqGIR.png
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @license      GPL-3.0 License
// @run-at       document-end
// @namespace    https://greasyfork.org/scripts/412245
// ==/UserScript==

(function() {
    var backColor = '#ffffff';
    var fontColor = '#888888';
    if (document.getElementsByTagName('html')[0].getAttribute('data-color-mode') == 'dark') { // 黑暗模式判断
        if (document.getElementsByTagName('html')[0].getAttribute('data-dark-theme') == 'dark_dimmed') {
            backColor = '#272e37';
            fontColor = '#768390';
        } else {
            backColor = '#161a21';
            fontColor = '#b2b8bf';
        }
    }
//['https://github.91chifun.workers.dev','美国'],
    var download_url = [
        ['https://gh.api.99988866.xyz','美国'],
        ['https://gh.msx.workers.dev','美国'],
        ['https://gh.xiu2.xyz','美国'],
        ['https://gh.argv.cc','美国费利蒙'],
        ['https://git.yumenaka.net','美国洛杉矶'],
        ['https://download.fastgit.org','日本东京'],
        ['https://ghproxy.com','韩国首尔'],
        ['https://pd.zwc365.com/seturl','中国香港']
    ],
        clone_url = [
            ['https://hub.fastgit.org','中国香港'],
            ['https://gitclone.com','中国浙江'],
            ['https://github.com.cnpmjs.org','新加坡']
        ],
        clone_ssh_url = [
            ['git@git.zhlh6.cn','中国北京'],
            ['git@hub.fastgit.org','中国香港']
        ],
        raw_url = [
            ['https://raw.githubusercontent.com','Github 原生',''],
            ['https://cdn.jsdelivr.net','中国国内','注意：该加速源存在缓存机制（24小时），所以文件可能不是最新。&#10;注意：当前分支所有文件总文件大小超过 50MB 时，该加速源不可用。&#10;注意：当前分支名为版本号格式时（如 v1.2.3），该高速下载链接因格式限制不可用。'],
            ['https://raw.fastgit.org','中国香港','注意：单个文件太大时可能会提示超时（实时获取中），请重试。'],
            ['https://ghproxy.com','韩国首尔','']
        ],
        svg = [
            '<svg class="octicon octicon-file-zip mr-3" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M3.5 1.75a.25.25 0 01.25-.25h3a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h2.086a.25.25 0 01.177.073l2.914 2.914a.25.25 0 01.073.177v8.586a.25.25 0 01-.25.25h-.5a.75.75 0 000 1.5h.5A1.75 1.75 0 0014 13.25V4.664c0-.464-.184-.909-.513-1.237L10.573.513A1.75 1.75 0 009.336 0H3.75A1.75 1.75 0 002 1.75v11.5c0 .649.353 1.214.874 1.515a.75.75 0 10.752-1.298.25.25 0 01-.126-.217V1.75zM8.75 3a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h-.5zM6 5.25a.75.75 0 01.75-.75h.5a.75.75 0 010 1.5h-.5A.75.75 0 016 5.25zm2 1.5A.75.75 0 018.75 6h.5a.75.75 0 010 1.5h-.5A.75.75 0 018 6.75zm-1.25.75a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h-.5zM8 9.75A.75.75 0 018.75 9h.5a.75.75 0 010 1.5h-.5A.75.75 0 018 9.75zm-.75.75a1.75 1.75 0 00-1.75 1.75v3c0 .414.336.75.75.75h2.5a.75.75 0 00.75-.75v-3a1.75 1.75 0 00-1.75-1.75h-.5zM7 12.25a.25.25 0 01.25-.25h.5a.25.25 0 01.25.25v2.25H7v-2.25z"></path></svg>',
            '<svg class="octicon octicon-clippy" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M5.75 1a.75.75 0 00-.75.75v3c0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75v-3a.75.75 0 00-.75-.75h-4.5zm.75 3V2.5h3V4h-3zm-2.874-.467a.75.75 0 00-.752-1.298A1.75 1.75 0 002 3.75v9.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0014 13.25v-9.5a1.75 1.75 0 00-.874-1.515.75.75 0 10-.752 1.298.25.25 0 01.126.217v9.5a.25.25 0 01-.25.25h-8.5a.25.25 0 01-.25-.25v-9.5a.25.25 0 01.126-.217z"></path></svg>',
            '<svg class="octicon octicon-cloud-download" aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path d="M9 12h2l-3 3-3-3h2V7h2v5zm3-8c0-.44-.91-3-4.5-3C5.08 1 3 2.92 3 5 1.02 5 0 6.52 0 8c0 1.53 1 3 3 3h3V9.7H3C1.38 9.7 1.3 8.28 1.3 8c0-.17.05-1.7 1.7-1.7h1.3V5c0-1.39 1.56-2.7 3.2-2.7 2.55 0 3.13 1.55 3.2 1.8v1.2H12c.81 0 2.7.22 2.7 2.2 0 2.09-2.25 2.2-2.7 2.2h-2V11h2c2.08 0 4-1.16 4-3.5C16 5.06 14.08 4 12 4z"></path></svg>'
        ],
        style = ['padding:0 6px;margin-right: -1px;border-radius: 2px;background-color: '+backColor+';border-color: rgba(27, 31, 35, 0.1);font-size: 11px;color: '+fontColor+';'],
        menu_raw_fast = GM_getValue('xiu2_menu_raw_fast'),
        menu_menu_raw_fast_ID, menu_feedBack_ID;
    if (menu_raw_fast == null){menu_raw_fast = 1; GM_setValue('xiu2_menu_raw_fast', 1)};

    registerMenuCommand();
    // 注册脚本菜单
    function registerMenuCommand() {
        if (menu_feedBack_ID) { // 如果反馈菜单ID不是 null，则删除所有脚本菜单
            GM_unregisterMenuCommand(menu_menu_raw_fast_ID);
            GM_unregisterMenuCommand(menu_feedBack_ID);
            menu_raw_fast = GM_getValue('xiu2_menu_raw_fast');
        }
        if (menu_raw_fast > raw_url.length - 1) { // 避免在减少 raw 数组后，用户储存的数据大于数组而报错
            menu_raw_fast = 0
        }
        menu_menu_raw_fast_ID = GM_registerMenuCommand(`🔄 [ ${raw_url[menu_raw_fast][1]} ] 加速源 (☁) - 点击切换`, menu_toggle_raw_fast);
        menu_feedBack_ID = GM_registerMenuCommand('💬 反馈 & 建议 [Github]', function () {window.GM_openInTab('https://github.com/XIU2/UserScript', {active: true,insert: true,setParent: true});window.GM_openInTab('https://greasyfork.org/zh-CN/scripts/412245/feedback', {active: true,insert: true,setParent: true});});
    }

    // 切换加速源
    function menu_toggle_raw_fast() {
        if (menu_raw_fast >= raw_url.length - 1) { // 如果当前加速源位置大于等于加速源总数，则改为第一个加速源，反之递增下一个加速源
            menu_raw_fast = 0;
        } else {
            menu_raw_fast += 1;
        }
        GM_setValue('xiu2_menu_raw_fast', menu_raw_fast);
        delRawDownLink(); // 删除旧加速源
        addRawDownLink(); // 添加新加速源
        GM_notification({text: "已切换加速源为：" + raw_url[menu_raw_fast][1], timeout: 3000}); // 提示消息
        registerMenuCommand(); // 重新注册脚本菜单
    };

    addRelease(); // Release 加速
    addDownloadZIP(); // Download ZIP 加速
    addGitClone(); // Git Clone 加速
    addGitCloneSSH(); // Git Clone SSH 加速
    addRawFile(); // Raw 加速
    setTimeout(addRawDownLink, 2000); // 添加 Raw 下载链接（☁），延迟 2 秒执行，避免被 pjax 刷掉

    document.addEventListener('pjax:success',function(){ // pjax 事件发生后
        addRelease(); // Release 加速
        addDownloadZIP(); // Download ZIP 加速
        addGitClone(); // Git Clone 加速
        addGitCloneSSH(); // Git Clone SSH 加速
        addRawFile(); // Raw 加速
        setTimeout(addRawDownLink, 2000); // 添加 Raw 下载链接（☁），延迟 2 秒执行，避免被 pjax 刷掉
    });

    pushHistory();
    window.addEventListener('popstate', function(e) {
        addRawDownLink_(); // 在浏览器返回/前进时重新添加 Raw 下载链接（☁）鼠标事件
    }, false);
    function pushHistory() {
        let state = {title: 'title',url: '#'};
        window.history.pushState(state, '', '');
    }


    // Release
    function addRelease() {
        let html = document.getElementsByClassName('Box Box--condensed');if (!html) return
        Array.from(html).forEach(function (current) {
            current.querySelectorAll('.d-flex.Box-body > a').forEach(function (_this) {
                let href = _this.href.split('github.com'),
                    url = [],
                    _html = `<div style="display: flex;justify-content: flex-end;">`;

                for (let i=0;i<download_url.length;i++){
                    if (download_url[i][0] === 'https://download.fastgit.org') {
                        url[i] = download_url[i][0] + href[1]
                    } else {
                        url[i] = download_url[i][0] + '/' + _this.href
                    }
                }

                for (let i=0;i<url.length;i++) {
                    _html += `<a style="${style[0]}" class="btn" href="${url[i]}" rel="noreferrer noopener nofollow">${download_url[i][1]}</a>`
                }
                _html += `</div>`
                _this.nextElementSibling.insertAdjacentHTML('afterend', _html);
            });
            // 修改[文件大小]元素样式
            document.querySelectorAll('small.pl-2.color-text-secondary.flex-shrink-0').forEach(el=>{el.style.cssText='display: flex; justify-content: flex-end; flex-grow: 1; margin-right: 8px;'});


            // Source Code
            current.querySelectorAll('.d-block.Box-body > a').forEach(function (_this) {
                let href = _this.href.split('github.com'),
                    url = [],
                    _html = `<div style="display: flex;justify-content: flex-end;flex-grow: 1;">`;

                for (let i=0;i<download_url.length;i++){
                    if (download_url[i][0] === 'https://download.fastgit.org') {
                        url[i] = download_url[i][0] + href[1]
                    } else {
                        url[i] = download_url[i][0] + '/' + _this.href
                    }
                }

                for (let i=0;i<url.length;i++) {
                    _html += `<a style="${style[0]}" class="btn" href="${url[i]}" rel="noreferrer noopener nofollow">${download_url[i][1]}</a>`
                }
                _html += `</div>`
                _this.insertAdjacentHTML('afterend', _html);
            });
        });
        // 修改 Source code 样式，使其和加速按钮并列一排
        document.querySelectorAll('div.d-block.py-1.py-md-2.Box-body.px-2').forEach(el=>{el.className='d-flex py-1 py-md-2 Box-body px-2'});
    }


    // Download ZIP
    function addDownloadZIP() {
        let html = document.querySelector('.dropdown-menu.dropdown-menu-sw.p-0 ul li:last-child');if (!html) return
        let href = html.getElementsByTagName('a')[0].href,
            url = [],
            _html = ``;

        for (let i=0;i<download_url.length;i++){
            if (download_url[i][0] === 'https://download.fastgit.org') {
                url[i] = download_url[i][0] + href.split('github.com')[1]
            } else {
                url[i] = download_url[i][0] + '/' + href
            }
        }

        for (let i=0;i<url.length;i++) {
            _html += `<li class="Box-row Box-row--hover-gray p-0"><a class="d-flex flex-items-center color-text-primary text-bold no-underline p-3" rel="noreferrer noopener nofollow" href="${url[i]}">${svg[0]}Download ZIP ${download_url[i][1]}</a></li>`
        }
        html.insertAdjacentHTML('afterend', _html);
    }


    // Git Clone
    function addGitClone() {
        let html = document.querySelector('[role="tabpanel"]:nth-child(2) div.input-group');if (!html) return
        let href_split = html.getElementsByTagName('input')[0].getAttribute('value').split('github.com'),
            url = [],
            _html = ``;

        for (let i=0;i<clone_url.length;i++){
            if (clone_url[i][0] === 'https://gitclone.com') {
                url[i] = clone_url[i][0] + '/github.com' + href_split[1]
            } else {
                url[i] = clone_url[i][0] + href_split[1]
            }
        }

        for (let i=0;i<url.length;i++) {
            _html += `<div class="input-group" style="margin-top: 4px;" title="加速源：${clone_url[i][1]} （点击可直接复制）"><input value="${url[i]}" aria-label="${url[i]}" type="text" class="form-control input-monospace input-sm bg-gray-light" data-autoselect="" readonly=""><div class="input-group-button"><clipboard-copy value="${url[i]}" aria-label="Copy to clipboard" class="btn btn-sm" tabindex="0" role="button">${svg[1]}</clipboard-copy></div></div>`
        }
        html.insertAdjacentHTML('afterend', _html);
    }


    // Git Clone SSH
    function addGitCloneSSH() {
        let html = document.querySelector('[role="tabpanel"]:nth-child(3) div.input-group');if (!html) return
        let href_split = html.getElementsByTagName('input')[0].getAttribute('value').split(':'),
            url = [],
            _html = ``;

        if (href_split[0] != 'git@github.com') return

        for (let i=0;i<clone_ssh_url.length;i++){
                url[i] = clone_ssh_url[i][0] + ':' + href_split[1]
        }

        for (let i=0;i<url.length;i++) {
            _html += `<div class="input-group" style="margin-top: 4px;" title="加速源：${clone_ssh_url[i][1]} （点击可直接复制）"><input value="${url[i]}" aria-label="${url[i]}" type="text" class="form-control input-monospace input-sm bg-gray-light" data-autoselect="" readonly=""><div class="input-group-button"><clipboard-copy value="${url[i]}" aria-label="Copy to clipboard" class="btn btn-sm" tabindex="0" role="button">${svg[1]}</clipboard-copy></div></div>`
        }
        html.insertAdjacentHTML('afterend', _html);
    }


    // Raw
    function addRawFile() {
        let html = document.getElementById('raw-url');if (!html) return
        let href = location.href.replace('https://github.com',''),
            href2 = href.replace('/blob/','/'),
            url = [
                raw_url[1][0] + "/gh" + href.replace('/blob/','@'),
                raw_url[2][0] + href2,
                raw_url[3][0] + "/" + raw_url[0][0] + href2
            ],
            _html = ``;
        for (let i=0;i<url.length;i++) {
            _html += `<a href="${url[i]}" title="${raw_url[i+1][2]}" role="button" rel="noreferrer noopener nofollow" class="btn btn-sm BtnGroup-item">${raw_url[i+1][1]}</a>`
        }
        html.insertAdjacentHTML('afterend', _html);
    }


    // 添加 Raw 下载链接（☁）
    function addRawDownLink() {
        // 如果不是项目文件页面，就返回，如果网页有 Raw 下载链接（☁）就返回
        let files = document.querySelectorAll('div.Box-row svg.octicon.octicon-file');if(files.length === 0) return;
        let files1 = document.querySelectorAll('a.fileDownLink');if(files1.length > 0) return;

        // 鼠标指向则显示
        var mouseOverHandler = function(evt) {
            let elem = evt.currentTarget,
                aElm_new = elem.querySelectorAll('.fileDownLink'),
                aElm_now = elem.querySelectorAll('svg.octicon.octicon-file.color-icon-tertiary');
            aElm_new.forEach(el=>{el.style.cssText = 'display: inline'});
            aElm_now.forEach(el=>{el.style.cssText = 'display: none'});
        };

        // 鼠标离开则隐藏
        var mouseOutHandler = function(evt) {
            let elem = evt.currentTarget,
                aElm_new = elem.querySelectorAll('.fileDownLink'),
                aElm_now = elem.querySelectorAll('svg.octicon.octicon-file.color-icon-tertiary');
            aElm_new.forEach(el=>{el.style.cssText = 'display: none'});
            aElm_now.forEach(el=>{el.style.cssText = 'display: inline'});
        };

        // 循环添加
        files.forEach(function(fileElm, i) {
            let trElm = fileElm.parentNode.parentNode,
                cntElm_a = trElm.querySelector('.css-truncate.css-truncate-target.d-block.width-fit a'),
                cntElm_svg = trElm.querySelector('.mr-3.flex-shrink-0 svg.octicon.octicon-file.color-icon-tertiary'),
                Name = cntElm_a.innerText,
                href = cntElm_a.attributes.href.nodeValue.replace('https://github.com','');
            let href2 = href.replace('/blob/','/'), url, url_name, url_tip = '';
            switch(menu_raw_fast) {
                case 1:
                    url = raw_url[1][0] + '/gh' + href.replace('/blob/','@');
                    url_name = raw_url[1][1];
                    url_tip = raw_url[1][2];
                    break;
                case 3:
                    url = raw_url[3][0] + "/" + raw_url[0][0] + href2;
                    url_name = raw_url[3][1];
                    url_tip = raw_url[3][2];
                    break;
                default:
                    url = raw_url[menu_raw_fast][0] + href2;
                    url_name = raw_url[menu_raw_fast][1];
                    url_tip = raw_url[menu_raw_fast][2];
                    break;
            }
            let _html = ` <a href="${url}" download="${Name}" target="_blank" rel="noreferrer noopener nofollow" class="fileDownLink" style="display: none;" title="「${url_name}」&#10;&#10;[Alt + 左键] 或 [右键 - 另存为...] 下载文件。&#10;注意：鼠标点击 [☁] 图标，而不是左侧的文件名！&#10;&#10;${url_tip}提示：点击浏览器右上角 Tampermonkey 扩展图标 - [ ${raw_url[menu_raw_fast][1]} ] 加速源 (☁) 即可切换。">${svg[2]}</a>`;
            cntElm_svg.insertAdjacentHTML('afterend', _html);
            // 绑定鼠标事件
            trElm.onmouseover = mouseOverHandler;
            trElm.onmouseout = mouseOutHandler;
        });
    }


    // 删除 Raw 快捷下载（☁）
    function delRawDownLink() {
        let aElm = document.querySelectorAll('.fileDownLink');if(aElm.length === 0) return;
        aElm.forEach(function(fileElm) {
            fileElm.remove()
        })
    }


    // 在浏览器返回/前进时重新添加 Raw 下载链接（☁）鼠标事件
    function addRawDownLink_() {
        // 如果不是项目文件页面，就返回，如果网页没有 Raw 下载链接（☁）就返回
        let files = document.querySelectorAll('div.Box-row svg.octicon.octicon-file');if(files.length === 0) return;
        let files1 = document.querySelectorAll('a.fileDownLink');if(files1.length === 0) return;

        // 鼠标指向则显示
        var mouseOverHandler = function(evt) {
            let elem = evt.currentTarget,
                aElm_new = elem.querySelectorAll('.fileDownLink'),
                aElm_now = elem.querySelectorAll('svg.octicon.octicon-file.color-icon-tertiary');
            aElm_new.forEach(el=>{el.style.cssText = 'display: inline'});
            aElm_now.forEach(el=>{el.style.cssText = 'display: none'});
        };

        // 鼠标离开则隐藏
        var mouseOutHandler = function(evt) {
            let elem = evt.currentTarget,
                aElm_new = elem.querySelectorAll('.fileDownLink'),
                aElm_now = elem.querySelectorAll('svg.octicon.octicon-file.color-icon-tertiary');
            aElm_new.forEach(el=>{el.style.cssText = 'display: none'});
            aElm_now.forEach(el=>{el.style.cssText = 'display: inline'});
        };

        // 循环添加
        files.forEach(function(fileElm, i) {
            let trElm = fileElm.parentNode.parentNode;
            // 绑定鼠标事件
            trElm.onmouseover = mouseOverHandler;
            trElm.onmouseout = mouseOutHandler;
        });
    }
})();