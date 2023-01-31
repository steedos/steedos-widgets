const File = {
    downloadFile(downloadProps) {
        let { download_url, file_name, file_size, object_name, record_id, file_id } = downloadProps;
        let url;
        if (window.Meteor && window.Meteor.isCordova) {
            return window.Steedos.cordovaDownload(download_url, file_name, file_id, file_size);
        } else {
            url = download_url + "?download=true";
            return window.location = url;
        }
    },
    previewFile(previewProps) {
        let { download_url, file_name, file_size, object_name, record_id, file_id } = previewProps;
        SteedosUI.downloadFile({ download_url, file_name, file_size, object_name, record_id, file_id });
    }
}


export const downloadFile = File.downloadFile;
export const previewFile = File.previewFile;