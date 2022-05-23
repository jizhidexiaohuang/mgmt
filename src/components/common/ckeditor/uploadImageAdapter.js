import { get, post ,postFormData } from '../../../libs/axios';

export default class UploadImageAdapter {
    constructor(loader) {
        this.loader = loader
    }
    
    uploadFile(file, resolve){
        const data = new FormData();
        data.append( 'file', file );
        postFormData('/base/cos/cosUpload',data).then(res=>{
            console.log(res)
            if(res.code===0){
                resolve({
                    default:res.data.presignedUrl
                })
            }
        })
    }
    upload() {
        return this.loader.file
            .then( file => new Promise( ( resolve, reject ) => {
                this.uploadFile(file, resolve);
            }));
    }

    // Aborts the upload process.
    abort() {
        // abortUpload();
    }
}