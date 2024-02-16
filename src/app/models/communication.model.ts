export interface Communication {
    id: string,
    idUser: string,
    idEstate: string,
    idCommunicationType: string,
    title:string,
    introduction:string,
    body:string,
    urlAttachmentDocument: string,
    creationDate: String,
    startDate: String,
    endDate: String,
    updateDate: String,
    signature: string,
    status: boolean,
}