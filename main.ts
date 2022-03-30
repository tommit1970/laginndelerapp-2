function tennMinimumLys (lag: number) {
    basic.clearScreen()
    if (lagListe.length == 0) {
        if (modus == "OpptellingLag") {
            antallVerdi = minLag
            index = minLag
        } else {
            antallVerdi = minDeltagere
        }
    } else {
        antallVerdi = lagListe[lag]
    }
    pixelReset()
    for (let index2 = 0; index2 < antallVerdi; index2++) {
        if (modus == "OpptellingDeltagere" || modus == "Bla-i-Lag") {
            visPixler("B", minDeltagere, maksDeltagere)
        } else {
            visPixler("B", minLag, maksLag)
        }
        basic.pause(200)
    }
    basic.pause(1000)
}
// Har kan brukeren bla seg gjennom listen av deltagere pr. lag
function blaiLagFunc (knapp: string) {
    // -1 betyr A knapptrykk
    // 1 betyr B knapptrykk(else)
    if (knapp == "A") {
        // Hindre pekeren i å gå for lavt
        if (lagPeker > 0) {
            // Pek på listeverdien før
            lagPeker += -1
        } else {
            // Gi et blink om at starten er nådd
            basic.clearScreen()
            led.plot(0, 2)
            basic.pause(500)
            led.unplot(0, 2)
        }
    } else if (knapp == "B") {
        // Hindre pekeren i å gå for høyt
        if (lagPeker < lagListe.length - 1) {
            // Pek på listeverdien etter
            lagPeker += 1
        } else {
            // Gi et blink om at slutten er nådd
            basic.clearScreen()
            led.plot(4, 2)
            basic.pause(500)
            led.unplot(4, 2)
        }
    }
    tennMinimumLys(lagPeker)
    visEnLagFordeling(lagPeker)
}
function beregnLagInndeling () {
    // Finner antall hele deltagere pr. lag
    deltagerePrLag = Math.floor(antallDeltagere / antallLag)
    // Finner antall deltagere som ikke er delt på lag
    restDeltagere = antallDeltagere % antallLag
    // Fordel antall hele deltagere på lag i liste
    for (let index2 = 0; index2 < antallLag; index2++) {
        lagListe.push(deltagerePrLag)
    }
    lagPeker = 0
    // Fordel resten så langt det går
    for (let index2 = 0; index2 < restDeltagere; index2++) {
        // Øk lagets verdi med 1
        // Øk lagets verdi med 1
        lagListe[lagPeker] = lagListe[lagPeker] + 1
        // Pek på neste lag
        lagPeker += 1
    }
}
// Her vises antallet på ett og ett lag om gangen, det bla
function visEnLagFordeling (lag: number) {
    basic.clearScreen()
    basic.pause(500)
    basic.showNumber(lagListe[lag])
}
function settKonstanter () {
    maksDeltagere = 55
    minDeltagere = 5
    maksLag = 10
    minLag = 2
}
function showPixelPoint () {
    basic.showNumber(pixelCol)
    basic.pause(500)
    basic.clearScreen()
    basic.pause(100)
    basic.showNumber(pixelRow)
    basic.pause(500)
    basic.clearScreen()
    basic.pause(100)
    basic.showNumber(internTeller)
}
// A og B knappen har ulik funksjon etter hvilken modus appen er i
// ("OpptellingDeltager"-, "OpptellingLag"- eller "Bla-i-Lag"-modus)
// Disse modusene går i loop og skiftes ved å trykke A+B.
input.onButtonPressed(Button.A, function () {
    if (modus == "OpptellingDeltagere") {
        visPixler("A", minDeltagere, maksDeltagere)
    } else if (modus == "OpptellingLag") {
        visPixler("A", minLag, maksLag)
    } else if (modus == "Bla-i-Lag") {
        blaiLagFunc("A")
    }
})
// Nullpunktet for LEDskjermen
// samt nullstill telleren
function pixelReset () {
    pixelCol = 4
    pixelRow = 5
    internTeller = 0
}
// Legg til pixel for ny deltager(col, row) eller lag(row, col)
function tennEttLys () {
    if (modus == "OpptellingDeltagere" || modus == "Bla-i-Lag") {
        // OpptellingDeltagere
        // Vertikal-telling
        led.plot(pixelCol, pixelRow)
    } else {
        // OpptellingLag
        // Horisontal-telling
        led.plot(pixelRow, pixelCol)
    }
}
function appReset () {
    settKonstanter()
    antallDeltagere = minDeltagere
    antallLag = minLag
    lagListe = []
    lagPeker = 0
    visPiler()
    tennMinimumLys(0)
}
// Hinter brukeren om at A og B knappene kan brukes
function visPiler () {
    basic.showArrow(ArrowNames.West)
    basic.pause(100)
    basic.showArrow(ArrowNames.East)
    basic.pause(100)
    basic.clearScreen()
}
// A+B knappene har en modus-skiftefunksjon
input.onButtonPressed(Button.AB, function () {
    if (modus == "OpptellingDeltagere") {
        // overfør tellerens verdi til antallDeltagere
        antallDeltagere = internTeller
        basic.clearScreen()
        // Hint til brukeren om antallet i 10-tallsform
        basic.showNumber(antallDeltagere)
        basic.pause(500)
        visPiler()
        basic.clearScreen()
        // Skift modus til OpptellingLag
        modus = "OpptellingLag"
        tennMinimumLys(0)
    } else if (modus == "OpptellingLag") {
        // overfør tellerens verdi til antallLag
        antallLag = internTeller
        basic.clearScreen()
        // Hint til brukeren om antallet i 10-tallsform
        basic.showNumber(antallLag)
        basic.pause(500)
        // Gjør beregninger og del inn i lagstørrelser utfra antallDeltagere og antallLag
        beregnLagInndeling()
        // Skift modus til Bla-i-Lag
        modus = "Bla-i-Lag"
        // Sørg for at det pekes mot første element i liste 
        lagPeker = 0
        tennMinimumLys(0)
        // Vi resultatene av lagstørrelsene
        visEnLagFordeling(lagPeker)
        basic.pause(500)
    } else if (modus == "Bla-i-Lag") {
        basic.clearScreen()
        // Reset variabler
        appReset()
        // Skift modus til OpptellingDeltagere
        modus = "OpptellingDeltagere"
    }
})
// Fjern pixel for ny deltager(col,row) eller lag(row,col)
function slukkEttLys () {
    if (modus == "OpptellingDeltagere") {
        led.unplot(pixelCol, pixelRow)
    } else {
        led.unplot(pixelRow, pixelCol)
    }
}
input.onButtonPressed(Button.B, function () {
    if (modus == "OpptellingDeltagere") {
        visPixler("B", minDeltagere, maksDeltagere)
    } else if (modus == "OpptellingLag") {
        visPixler("B", minLag, maksLag)
    } else if (modus == "Bla-i-Lag") {
        blaiLagFunc("B")
    }
})
// Denne funksjonen håndterer visning av pixler.
// A knappen fjerner pixler. B knappen legger til pixler.
// 
// I OpptellingDeltager- og OpptellingLag-modus finnes grenseverdiene bunnTall og toppTall
function visPixler (knapp: string, bunnTall: number, toppTall: number) {
    // Når A  eller B trykkes, gjør forskjellig
    if (knapp == "A") {
        // Hindre at telleren blir for lav
        if (internTeller > bunnTall) {
            // Fjern en pixel
            slukkEttLys()
            // Reduser teller
            internTeller += -1
            // Skift Pixel-fokus, en rad ned
            pixelRow += 1
            // Skift kolonne når kolonne er tom
            if (pixelRow == 5) {
                // Øverst
                pixelRow = 0
                // Flytt en kolonne til høyre
                pixelCol += 1
            }
            // Helt tom ledskjerm og teller ikke er null?
            // Fyll skjerm
            // Fjern pixel i øvre venstre hjørne(0,0)
            if (pixelCol == 5 && internTeller > bunnTall) {
                basic.showLeds(`
                    # # # # #
                    # # # # #
                    # # # # #
                    # # # # #
                    # # # # #
                    `)
                pixelCol = 0
            }
        } else {
            // Varsle(et blink) om at 0 er minste verdi
            led.plot(2, 2)
            basic.pause(500)
            led.unplot(2, 2)
        }
    } else if (knapp == "B") {
        // Hindre at telleren blir for høy
        if (internTeller < toppTall) {
            internTeller += 1
            // Beveg opp i pixel mønster(Deltagere) eller
            // Beveg venstre i pixelmønster(Lag)
            // 
            pixelRow += -1
            // På toppen?(Deltagere)
            // Gå ned
            // Helt til venstre?(Lag)
            // Gå til høyre
            if (pixelRow < 0) {
                pixelRow = 4
                pixelCol += -1
            }
            // Helt fullt?
            // Blank ut skjerm og tenn første pixel
            if (pixelCol == -1) {
                basic.clearScreen()
                pixelCol = 4
            }
            tennEttLys()
        } else {
            // Varsle(et blink) om at telleren er full
            // Hvis LED(2,2) er tent, slukk og tenn for å vise at vi er på maks, hvis ikke tenn og slukk.
            // Uansett: gi et like blink
            // 
            // LED(2,2) er tent på verdi 13, 38 og 63 osv.
            // Avhenger av variabel maksDeltagere
            if (led.point(2, 2)) {
                led.unplot(2, 2)
                basic.pause(500)
                led.plot(2, 2)
            } else {
                led.plot(2, 2)
                basic.pause(500)
                led.unplot(2, 2)
            }
        }
    }
}
let internTeller = 0
let pixelRow = 0
let pixelCol = 0
let restDeltagere = 0
let antallLag = 0
let antallDeltagere = 0
let deltagerePrLag = 0
let lagPeker = 0
let maksLag = 0
let maksDeltagere = 0
let minDeltagere = 0
let index = 0
let minLag = 0
let antallVerdi = 0
let lagListe: number[] = []
let modus = ""
pixelReset()
modus = "OpptellingDeltagere"
appReset()
