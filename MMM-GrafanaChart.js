/* MMM-GrafanaChart
 * This MagicMirror² module allows you to display a chart generated by grafana.
 *
 * By SvenSommer https://github.com/SvenSommer
 * MIT Licensed.
 */


Module.register("MMM-GrafanaChart", {
    // Default module config.
    defaults: {
        protocol: "http", // this is needed, so it can be overwritten in the old-style config
        style: "border:0",
        url1: "",
        url2: "",
        height0:"100%",
        width0:"100%",
        height1:"100%",
        width1:"100%",
        height2:"100%",
        width2:"100%",
        html:"",
        height:"100%",
        width:"100%",
        scrolling:"no",
        gap: "0px",
        top: "0px",
        refreshInterval: 86400
    },

    // Define start sequence.
    start: function() {
        Log.info("Starting module: " + this.name);
        // if the user did not provide a URL property, try to assemble one from the older config style, that stored everything in parts
        if( this.config.url === "invalid" ){
            this.config.url = this.buildUrl();
        }
        this.scheduleUpdate();
    },

    buildUrl: function() {
        var URL = "";
        URL += this.config.protocol + "://";
        URL += this.config.host + ":" + this.config.port;
        if (this.config.version == "6") {
            URL += "/d-solo/" + this.config.id;
        } else{
            URL += "/dashboard-solo/db";
        }
        URL += "/" + this.config.dashboardname;
        URL += "?orgId=" + this.config.orgId;
        URL += "&panelId=" + this.config.panelId;
        if( this.config.from ){
            URL += "&from=" + this.config.from;
        }
        if( this.config.to ){
            URL += "&to=" + this.config.to
        }
        if (this.config.version == "6") {
            URL += "&fullscreen&kiosk";
        }
        return URL;
    },


    // Override dom generator.
    getDom: function() {
        //if( ! this.config.url.match(/^https?:/i) ){
        //    return document.createTextNode(this.name+" found no usable URL configured. Please check your config!");
        //}

        var div = document.createElement("div");

        if(this.config.html != "")
        {
                div.innerHTML = this.config.html;
        }

        div.width = this.config.width;
        div.height = this.config.height;
        div.style = this.config.style;

        var top = document.createElement("div");
        top.style = "height:"+this.config.top;
        top.setAttribute("timestamp", new Date().getTime());
        div.appendChild(top);

        if(this.config.url1 != "")
        {
                var iframe1_div = document.createElement("div");
                iframe1_div.width = this.config.width0;
                iframe1_div.height = this.config.height0;
                var iframe1 = document.createElement("IFRAME");
                iframe1.style = "border:0";
                iframe1.width = this.config.width1;
                iframe1.height = this.config.height1;
                iframe1.scrolling = this.config.scrolling;
                iframe1.src = this.config.url1;
                iframe1.setAttribute("timestamp", new Date().getTime());
                iframe1_div.appendChild(iframe1);
                iframe1_div.setAttribute("timestamp", new Date().getTime());
                div.appendChild(iframe1_div);
        }

        var spacer = document.createElement("div");
        spacer.style = "height:"+this.config.gap;
        spacer.setAttribute("timestamp", new Date().getTime());
        div.appendChild(spacer);

        if(this.config.url2 != "")
        {
                var iframe2 = document.createElement("IFRAME");
                iframe2.style = "border:0";
                iframe2.width = this.config.width2;
                iframe2.height = this.config.height2;
                iframe2.scrolling = this.config.scrolling;
                iframe2.src = this.config.url2;
                iframe2.setAttribute("timestamp", new Date().getTime());
                div.appendChild(iframe2);
        }

        div.setAttribute("timestamp", new Date().getTime());

        return div;
    },
    scheduleUpdate: function() {
        var self = this;
        setTimeout(function() {
            self.updateFrame();
        }, this.config.refreshInterval*1000);
    },
    updateFrame: function() {
        Log.info("attempting to update dom for iFrameReload");
        this.updateDom(1000);
        this.scheduleUpdate();
    }
});
