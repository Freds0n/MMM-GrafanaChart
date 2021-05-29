/* MMM-GrafanaChart
 * This MagicMirror² module allows you to display a chart generated by grafana.
 *
 * By SvenSommer https://github.com/SvenSommer
 * MIT Licensed.
 */


Module.register("MMM-GrafanaChart", {
    // Default module config.
    defaults: {
        protocol: "http",
        height:"100%",
        width:"100%",
        scrolling:"no",
        refreshInterval: 900
    },

    // Define start sequence.
    start: function() {
        Log.info("Starting module: " + this.name);
        this.scheduleUpdate(this.config.refreshInterval);
    },
    // Override dom generator.
    getDom: function() {
        var iframe = document.createElement("IFRAME");
        iframe.style = "border:0"
        iframe.width = this.config.width;
        iframe.height = this.config.height;
        iframe.scrolling = this.config.scrolling;
        if (this.config.version == "6") {
            iframe.src =  this.config.protocol + "://" +  this.config.host + ":" + this.config.port + "/d-solo/" + this.config.id + "/" + this.config.dashboardname +  "?orgId=" + this.config.orgId + "&panelId=" + this.config.panelId + "&from=" + this.config.from + "&to=" + this.config.to + "&fullscreen&kiosk";
        } else{
            iframe.src =  this.config.protocol + "://" +  this.config.host + ":" + this.config.port + "/dashboard-solo/db/" + this.config.dashboardname+  "?orgId=" + this.config.orgId + "&panelId=" + this.config.panelId + "&from=" + this.config.from + "&to=" + this.config.to;;
        }
        iframe.setAttribute("timestamp", new Date().getTime());
        return iframe;
    },
    scheduleUpdate: function(delay) {
        var nextLoad = this.config.refreshInterval;
        if (typeof delay !== "undefined" && delay >= 0) {
            nextLoad = delay * 1000; // Convert seconds to millis
        }
        var self = this;
        setTimeout(function() {
            self.updateFrame();
        }, nextLoad);
    },
    updateFrame: function() {
        if (this.config.url === "") {
            Log.error("Tried to refresh, iFrameReload URL not set!");
            return;
        }
        Log.info("attempting to update dom for iFrameReload");
        Log.info('/"this/" module is: ' + this);
        this.updateDom(1000);
        this.scheduleUpdate(this.config.refreshInterval);
    }
});
