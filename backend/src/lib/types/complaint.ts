import { ComplaintCategory } from "@prisma/client"

export interface ResultComplaint {
    action: "CREATE_COMPLAINT",
    data: {
        title: string,
        description: string,
        category: ComplaintCategory
    }
}