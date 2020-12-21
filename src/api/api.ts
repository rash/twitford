import fetch from "node-fetch"

export class Api {
    private API_HEADERS: any

    constructor(bearerToken: string) {
        this.API_HEADERS = { "authorization": `Bearer ${bearerToken}` }
    }

    async getUserProperties(username: string) {
        const response = fetch(`https://api.twitter.com/2/users/by?usernames=${username}&user.fields=protected,public_metrics`, {
            method: "get",
            headers: this.API_HEADERS
        })
        try {
            return await (await response).json()
        } catch (error) {
            console.log("Error: An unknown error occurred when getting the user's properties.")
            console.error(error)
            process.exit(1)
        }
    }

    async getUserFriends(id: string) {
        const response = fetch(`https://api.twitter.com/2/users/${id}/following?user.fields=public_metrics&max_results=1000`, {
            method: "get",
            headers: this.API_HEADERS
        })
        const friends: any[] = []
        try {
            await (await response).json().then(async response => {
                this.pushNewFriends(friends, response.data)
                var metaToken = response.meta.next_token
                while (response.meta.next_token != undefined) {
                    const nextResponse = fetch(`https://api.twitter.com/2/users/${id}/following?user.fields=public_metrics&max_results=1000&pagination_token=${metaToken}`, {
                        method: "get",
                        headers: this.API_HEADERS
                    })
                    response = await (await nextResponse).json()
                    this.pushNewFriends(friends, response.data)
                }
            })
            return friends
        } catch (error) {
            console.log("Error: An unknown error occurred when getting the user's friends.")
            console.error(error)
            process.exit(1)
        }
    }

    private pushNewFriends(currentFriends: any[], newFriends: any[]) {
        newFriends.forEach(newFriend => currentFriends.push(newFriend))
    }
}