import { LightningElement, wire, api, track } from 'lwc';
import getAccountList from '@salesforce/apex/AccountController.getAccountList'

export default class Npaadmin2 extends LightningElement {
    @track loader = false;
    @track error = null;
    @track pageSize = 10;
    @track pageNumber = 1;
    @track totalRecords = 0;
    @track totalPages = 0;
    @track recordEnd = 0;
    @track recordStart = 0;
    @track isPrev = true;
    @track isNext = true;
    @track accounts = [];
 
    //On load
    connectedCallback() {
        this.getAccounts();
    }
 
    //handle next
    handleNext(){
        this.pageNumber = this.pageNumber+1;
        this.connectedCallback();
    }
 
    //handle prev
    handlePrev(){
        this.pageNumber = this.pageNumber-1;
        this.getAccounts();
        this.connectedCallback();
    }
 
    //get accounts
    getAccounts(){
        this.loader = true;
        getAccountList({pageSize: this.pageSize, pageNumber : this.pageNumber})
        .then(result => {
            this.loader = false;
            if(result){
                var resultData = JSON.parse(result);
                this.accounts = resultData.accounts;
                this.pageNumber = resultData.pageNumber;
                this.totalRecords = resultData.totalRecords;
                this.recordStart = resultData.recordStart;
                this.recordEnd = resultData.recordEnd;
                this.totalPages = Math.ceil(resultData.totalRecords / this.pageSize);
                this.isNext = (this.pageNumber == this.totalPages || this.totalPages == 0);
                this.isPrev = (this.pageNumber == 1 || this.totalRecords < this.pageSize);
            }
        })
        .catch(error => {
            this.loader = false;
            this.error = error;
        });
    }
 
    //display no records
    get isDisplayNoRecords() {
        var isDisplay = true;
        if(this.accounts){
            if(this.accounts.length == 0){
                isDisplay = true;
            }else{
                isDisplay = false;
            }
        }
        return isDisplay;
    }
       columns = [
        { label: 'Account Name', fieldName: 'Name', type:'url', typeAttributes:{label:{fieldName: 'Name'}, target:'_blank'} },
        { label: 'Account Id', fieldName: 'Id', type: 'Text' },
        { label: 'Website', fieldName: 'Website', type: 'url' },
        { label: 'Phone', fieldName: 'Phone', type: 'Phone' },
    ];
}