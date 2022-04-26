export interface CreateVirtualAccountInterface{
    meansofId: string
    utilityBill: string
    attachments: string
    occupation: string
    KYCInformation: {
        firstName: string
        lastName: string
        email: string
        birthDate: string
        bvn: string
        address: {
            country: string
            zip: string
            street: string
            state: string
            city: string
        }
        document: {
            type: string
            number: string
            issuedCountryCode: string
            issuedBy: string
            issuedDate: string
            expirationDate: string
        }
        occupation: string
    }
}