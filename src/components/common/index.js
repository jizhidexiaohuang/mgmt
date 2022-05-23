import City from '@/components/common/city/city.vue';
import chooseCity from '@/components/common/chooseCity/chooseCity.vue';
import fileUpload from "@/components/common/fileUpload/fileUpload.vue";
import fileContainer from "@/components/common/fileContainer/fileContainer.vue";
import fileImage from '@/components/common/fileImage/fileImage.vue';
import foldBlock from '@/components/common/foldBlock/foldBlock.vue';
import myViewer from "@/components/common/myViewer/myViewer.vue";
import mySelect from "@/components/common/mySelect/mySelect.vue";
import inputSelect from "@/components/common/inputSelect/inputSelect.vue";
import myInput from '@/components/common/myInput/myInput.vue';
import tianyancha from "@/components/common/tianyancha/tianyancha.vue";
import transferTree from '@/components/common/transferTree/transferTree.vue';
import wpsFile from '@/components/common/wpsFile/wpsFile.vue';
import multiFileUpload from "@/components/common/multiFileUpload/multiFileUpload";
import contractSubject from "@/components/common/contractSubject/contractSubject";
import previewFile from '@/components/common/previewFile/previewFile.vue';
import checkboxTable from "@/components/common/checkboxTable/index.vue";
import logisticsInformation from '@/components/common/logisticsInformation/index.vue';
import Ckeditor from '@/components/common/ckeditor/index.vue';
import tagManage from '@/components/common/tagManage/index.vue';
import countDown from "@/components/common/countDown/countDown.vue";

const views = {
    City,
    chooseCity,
    fileUpload,
    fileContainer,
    fileImage,
    myViewer,
    mySelect,
    inputSelect,
    tianyancha,
    foldBlock,
    myInput,
    transferTree,
    wpsFile,
    multiFileUpload,
    contractSubject,
    previewFile,
    checkboxTable,
    logisticsInformation,
    Ckeditor,
    tagManage,
    countDown
}

const install = function(Vue){
	Object.keys(views).forEach((key) => {
		Vue.component(key,views[key])
	})
}

const API = {
	install
}

export default API;