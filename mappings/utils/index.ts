/* eslint-disable prefer-const */
import { BigInt, BigDecimal, Address } from "@graphprotocol/graph-ts";
import { ERC20 } from "../../generated/Factory/ERC20";
import { ERC20NameBytes } from "../../generated/Factory/ERC20NameBytes";
import { ERC20SymbolBytes } from "../../generated/Factory/ERC20SymbolBytes";
import { Factory as FactoryContract } from "../../generated/templates/Pair/Factory";

export let ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
export let FACTORY_ADDRESS = "0xB7926C0430Afb07AA7DEfDE6DA862aE0Bde767bc";

export let WBNB_ADDRESS = "0xae13d989dac2f0debff460ac112a837c89baa7cd";
export let USDT_ADDRESS = "0x7ef95a0fee0dd31b22626fa2e10ee6a223f8a684";
export let BTC_ADDRESS = "0x6ce8da28e2f864420840cf74474eff5fd80e65b8";

export let ZERO_BI = BigInt.fromI32(0);
export let ONE_BI = BigInt.fromI32(1);
export let ZERO_BD = BigDecimal.fromString("0");
export let ONE_BD = BigDecimal.fromString("1");
export let BI_18 = BigInt.fromI32(18);

export let factoryContract = FactoryContract.bind(Address.fromString(FACTORY_ADDRESS));

export function exponentToBigDecimal(decimals: BigInt): BigDecimal {
  let bd = BigDecimal.fromString("1");
  for (let i = ZERO_BI; i.lt(decimals as BigInt); i = i.plus(ONE_BI)) {
    bd = bd.times(BigDecimal.fromString("10"));
  }
  return bd;
}

export function convertTokenToDecimal(tokenAmount: BigInt, exchangeDecimals: BigInt): BigDecimal {
  if (exchangeDecimals == ZERO_BI) {
    return tokenAmount.toBigDecimal();
  }
  return tokenAmount.toBigDecimal().div(exponentToBigDecimal(exchangeDecimals));
}

export function isNullBnbValue(value: string): boolean {
  return value == "0x0000000000000000000000000000000000000000000000000000000000000001";
}

export function fetchTokenSymbol(tokenAddress: Address): string {
  let contract = ERC20.bind(tokenAddress);
  let contractSymbolBytes = ERC20SymbolBytes.bind(tokenAddress);

  let symbolValue = "unknown";
  let symbolResult = contract.try_symbol();
  if (symbolResult.reverted) {
    let symbolResultBytes = contractSymbolBytes.try_symbol();
    if (!symbolResultBytes.reverted) {
      if (!isNullBnbValue(symbolResultBytes.value.toHex())) {
        symbolValue = symbolResultBytes.value.toString();
      }
    }
  } else {
    symbolValue = symbolResult.value;
  }
  if (tokenAddress == Address.fromString(WBNB_ADDRESS)) {
    symbolValue = "WBNB"
  }
  if (tokenAddress == Address.fromString(USDT_ADDRESS)) {
    symbolValue = "USDT"
  }
  if (tokenAddress == Address.fromString(BTC_ADDRESS)) {
    symbolValue = "BTCB"
  }
  return symbolValue;
}

export function fetchTokenName(tokenAddress: Address): string {
  let contract = ERC20.bind(tokenAddress);
  let contractNameBytes = ERC20NameBytes.bind(tokenAddress);

  let nameValue = "unknown";
  let nameResult = contract.try_name();
  if (nameResult.reverted) {
    let nameResultBytes = contractNameBytes.try_name();
    if (!nameResultBytes.reverted) {
      if (!isNullBnbValue(nameResultBytes.value.toHex())) {
        nameValue = nameResultBytes.value.toString();
      }
    }
  } else {
    nameValue = nameResult.value;
  }
  if (tokenAddress == Address.fromString(WBNB_ADDRESS)) {
    nameValue = "Wrapped BNB"
  }
  if (tokenAddress == Address.fromString(USDT_ADDRESS)) {
    nameValue = "Tether USD"
  }
  if (tokenAddress == Address.fromString(BTC_ADDRESS)) {
    nameValue = "BTCB Token"
  }
  return nameValue;
}

export function fetchTokenDecimals(tokenAddress: Address): BigInt {
  if (tokenAddress == Address.fromString(WBNB_ADDRESS) || tokenAddress == Address.fromString(USDT_ADDRESS) || tokenAddress == Address.fromString(BTC_ADDRESS)) {
    let decimalValue = 18;
    return BigInt.fromI32(decimalValue as i32);
  } else {
    let contract = ERC20.bind(tokenAddress);
    let decimalValue = null;
    let decimalResult = contract.try_decimals();
    if (!decimalResult.reverted) {
      decimalValue = decimalResult.value;
    }
    return BigInt.fromI32(decimalValue as i32);
  }
}
