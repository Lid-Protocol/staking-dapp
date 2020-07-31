export function removeDecimal(decimalString) {
  decimalString = decimalString.toString()
  if(!decimalString.includes('.')) return decimalString
  return decimalString.substring(0,decimalString.indexOf('.'))
}

export function shortEther(wei,web3) {
  if(wei===undefined || wei == null) return ""
  const toBN = web3.utils.toBN
  const fromWei = web3.utils.fromWei


  wei = wei.toString()
  if(wei === "") return ""

  const etherString = removeDecimal(fromWei(wei))

  if(toBN(etherString).lt(toBN("1"))) {
    return Number(Number(fromWei(wei)).toPrecision(4)).toString()
  }

  if(toBN(etherString).lt(toBN("1000"))) {
    return Number(fromWei(wei)).toPrecision(4).toString()
  }
  const etherBN = toBN(etherString)
  let resultNum
  let resultSuffix
  if(etherBN.gte(toBN("1000000"))){
    resultSuffix = "M"
    resultNum = (Number(fromWei(wei))/1000000).toPrecision(4).toString()
  } else if(etherBN.gte(toBN("1000"))) {
    resultSuffix = "K"
    resultNum = (Number(fromWei(wei))/1000).toPrecision(4).toString()
  }

  return resultNum+resultSuffix
}
