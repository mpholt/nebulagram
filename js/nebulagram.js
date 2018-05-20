var NebPay = require("nebpay");
var nebPay = new NebPay();
var serialNumber;
var dappAddress = "n1xjqJ4q3FkFnGD2zuJMAdfK1CLpJzuNvvt";

function onSendClick() {
    if(typeof(webExtensionWallet) === "undefined") {
        alert ("Nebulas Wallet Extension required. Please see the \"Get Free NAS\" section on the page to install the wallet.")
    }
    else {
        var to = document.getElementById("sendTo").value;
        var message = document.getElementById("sendMessage").value;

        if (!to || to === "" || !message || message === "") {
            alert("You must fill in to and message");
        }
        else {
            var callArgs = "[ \"" + to + "\", \"" + message + "\"]";
            serialNumber = nebPay.call(dappAddress, 0, "sendMessage", callArgs, {
                listener: displayTransaction
            });
        }
    }
}

function displayTransaction(resp) {
    $.get("success.html", function(data) {
        var resultsData = $(data);

        var message = resp.txhash;
        resultsData[0].innerHTML = resultsData[0].innerHTML.replace("TRANSACTION_VALUE", message);
        
        $("#sendForm").fadeOut('slow', function(){
            $('#results').html(resultsData);
        });
    });
}

function onViewTransactionClick() {
    var transaction = document.getElementById("transaction").value;

    var url = "https://explorer.nebulas.io/#/testnet/tx/" +transaction;

    window.open(url,'_blank')
}

var nebulas = require("nebulas"),
    Account = nebulas.Account,
    neb = new nebulas.Neb();
    neb.setRequest(new nebulas.HttpRequest("https://testnet.nebulas.io"));

function onReadClick() {
    var from = document.getElementById("fromAddress").value;

    var value = "0";
    var nonce = "0"
    var gas_price = "1000000"
    var gas_limit = "2000000"
    var callFunction = "readMessage";
    var callArgs = ""; //in the form of ["args"]
    var contract = {
        "function": callFunction,
        "args": callArgs
    }

    neb.api.call(from,dappAddress,value,nonce,gas_price,gas_limit,contract).then(function (resp) {
        var result = resp.result;

        document.getElementById('retrievedMessage').value = result;

        document.getElementById("readResult").style.visibility = "visible";
    }).catch(function (err) {
        document.getElementById('retrievedMessage').value = err.message;

        document.getElementById("readResult").style.visibility = "visible";
    })
}