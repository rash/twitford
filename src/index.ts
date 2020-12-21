import { Api } from "./api/api"
import { readFileSync } from "fs";

const args = process.argv.slice(2);
if (args.length != 1) {
    handleError(`Expected 1 argument but got ${args.length}`)
}
const token = getBearerToken()
const username = args[0]
if (token == undefined) {
    handleError("No bearer token was provided in the config")
}
const api = new Api(token)
const leadingDigitCount: Map<number, number> = new Map()
const expectedFrequencyMap: Map<number, number> = new Map()
for (var i = 1; i <= 9; i++) {
    expectedFrequencyMap.set(i, Math.log10(1 + 1 / i))
}
api.getUserProperties(username).then(async props => {
    const data = props.data[0]
    if (data.protected) {
        handleError(`${data.username} is currently protected`)
    }
    if (data.public_metrics.following_count == 0) {
        handleError(`${data.username} is not following anyone`)
    } else {
        incrementLeadingDigitCount(getLeadingDigit(data.public_metrics.following_count))
    }
    if (data.public_metrics.followers_count != 0) {
        incrementLeadingDigitCount(getLeadingDigit(data.public_metrics.followers_count))
    }
    await api.getUserFriends(data.id).then(friends => {
        if (friends != undefined) {
            friends.forEach(async friend => {
                const leadingDigit = getLeadingDigit(friend.public_metrics.following_count)
                if (leadingDigit != 0) {
                    incrementLeadingDigitCount(leadingDigit)
                }
            })
        }
    })
    const totalCount = getTotalCount()
    const xScores: number[] = Array.from(expectedFrequencyMap.values())
    const yScores: number[] = []
    const squaredXScores = xScores.map(xScore => xScore ** 2)
    const squaredYScores: number[] = []
    const productsOfPairedScores: number[] = []
    leadingDigitCount.forEach((value, key) => {
        const actualFrequency = value / totalCount
        const expectedFrequency = expectedFrequencyMap.get(key)!
        yScores.push(actualFrequency)
        squaredYScores.push(actualFrequency ** 2)
        productsOfPairedScores.push(actualFrequency * expectedFrequency)
    })
    const numberOfPairs = productsOfPairedScores.length
    const sumOfProductsOfPairs = getSumOfArray(productsOfPairedScores)
    const xScoresSum = getSumOfArray(xScores)
    const yScoresSum = getSumOfArray(yScores)
    const squaredXScoresSum = getSumOfArray(squaredXScores)
    const squaredYScoresSum = getSumOfArray(squaredYScores)
    const pearsonCorrelation = (numberOfPairs * sumOfProductsOfPairs - xScoresSum * yScoresSum) / Math.sqrt((numberOfPairs * squaredXScoresSum - (xScoresSum ** 2)) * (numberOfPairs * squaredYScoresSum - (yScoresSum ** 2)))
    console.log(`The Pearson correlation of ${data.username} is ${pearsonCorrelation}.`)
})

function getBearerToken(): string {
    const config = JSON.parse(readFileSync("config.json", "utf-8"))
    return config.token
}

function handleError(message: string) {
    console.log(`Error: ${message}.`)
    process.exit(1)
}

function incrementLeadingDigitCount(leadingDigit: number) {
    const value = leadingDigitCount.get(leadingDigit)
    leadingDigitCount.set(leadingDigit, value == undefined ? 1 : value + 1)
}

function getLeadingDigit(number: number) {
    return Number(number.toString().charAt(0))
}

function getTotalCount() {
    var sum = 0;
    leadingDigitCount.forEach((value, _) => {
        sum += value
    })
    return sum
}

function getSumOfArray(array: number[]) {
    return array.reduce((accumulator, currentValue) => currentValue + accumulator)
}