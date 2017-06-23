var CURVES = {
    "ED25519": {
        "XXX": "256",
        "YYY": "25519",
        "ZZZ": "ED25519",
        "@NB": 32,
        "@BASE": 24,
        "@NBT": 255,
        "@M8": 5,
        "@MT": 1,
        "@CT": 1,
        "@PF": 0
    },

    "C25519": {
        "XXX": "256",
        "YYY": "25519",
        "ZZZ": "C25519",
        "@NB": 32,
        "@BASE": 24,
        "@NBT": 255,
        "@M8": 5,
        "@MT": 1,
        "@CT": 2,
        "@PF": 0
    },

    "NIST256": {
        "XXX": "256",
        "YYY": "NIST256",
        "ZZZ": "NIST256",
        "@NB": 32,
        "@BASE": 24,
        "@NBT": 256,
        "@M8": 7,
        "@MT": 0,
        "@CT": 0,
        "@PF": 0
    },

    "NIST384": {
        "XXX": "384",
        "YYY": "NIST384",
        "ZZZ": "NIST384",
        "@NB": 48,
        "@BASE": 56,
        "@NBT": 384,
        "@M8": 7,
        "@MT": 0,
        "@CT": 0,
        "@PF": 0
    },

    "BRAINPOOL": {
        "XXX": "256",
        "YYY": "BRAINPOOL",
        "ZZZ": "BRAINPOOL",
        "@NB": 32,
        "@BASE": 24,
        "@NBT": 256,
        "@M8": 7,
        "@MT": 0,
        "@CT": 0,
        "@PF": 0
    },

    "ANSSI": {
        "XXX": "256",
        "YYY": "ANSSI",
        "ZZZ": "ANSSI",
        "@NB": 32,
        "@BASE": 24,
        "@NBT": 256,
        "@M8": 7,
        "@MT": 0,
        "@CT": 0,
        "@PF": 0
    },

    "HIFIVE": {
        "XXX": "336",
        "YYY": "HIFIVE",
        "ZZZ": "HIFIVE",
        "@NB": 42,
        "@BASE": 23,
        "@NBT": 336,
        "@M8": 5,
        "@MT": 1,
        "@CT": 1,
        "@PF": 0
    },

    "GOLDILOCKS": {
        "XXX": "448",
        "YYY": "GOLDILOCKS",
        "ZZZ": "GOLDILOCKS",
        "@NB": 56,
        "@BASE": 23,
        "@NBT": 448,
        "@M8": 7,
        "@MT": 2,
        "@CT": 1,
        "@PF": 0
    },

    "C41417": {
        "XXX": "416",
        "YYY": "C41417",
        "ZZZ": "C41417",
        "@NB": 52,
        "@BASE": 23,
        "@NBT": 414,
        "@M8": 7,
        "@MT": 1,
        "@CT": 1,
        "@PF": 0
    },

    "NIST521": {
        "XXX": "528",
        "YYY": "NIST521",
        "ZZZ": "NIST521",
        "@NB": 66,
        "@BASE": 23,
        "@NBT": 521,
        "@M8": 7,
        "@MT": 1,
        "@CT": 0,
        "@PF": 0
    },

    "MF254W": {
        "XXX": "256",
        "YYY": "254MF",
        "ZZZ": "MF254W",
        "@NB": 32,
        "@BASE": 24,
        "@NBT": 254,
        "@M8": 7,
        "@MT": 3,
        "@CT": 0,
        "@PF": 0
    },

    "MF254E": {
        "XXX": "256",
        "YYY": "254MF",
        "ZZZ": "MF254E",
        "@NB": 32,
        "@BASE": 24,
        "@NBT": 254,
        "@M8": 7,
        "@MT": 3,
        "@CT": 1,
        "@PF": 0
    },

    "MF254M": {
        "XXX": "256",
        "YYY": "254MF",
        "ZZZ": "MF254M",
        "@NB": 32,
        "@BASE": 24,
        "@NBT": 254,
        "@M8": 7,
        "@MT": 3,
        "@CT": 2,
        "@PF": 0
    },

    "MF256W": {
        "XXX": "256",
        "YYY": "256MF",
        "ZZZ": "MF256W",
        "@NB": 32,
        "@BASE": 24,
        "@NBT": 256,
        "@M8": 7,
        "@MT": 3,
        "@CT": 0,
        "@PF": 0
    },

    "MF256E": {
        "XXX": "256",
        "YYY": "256MF",
        "ZZZ": "MF256E",
        "@NB": 32,
        "@BASE": 24,
        "@NBT": 256,
        "@M8": 7,
        "@MT": 3,
        "@CT": 1,
        "@PF": 0
    },

    "MF256M": {
        "XXX": "256",
        "YYY": "256MF",
        "ZZZ": "MF256M",
        "@NB": 32,
        "@BASE": 24,
        "@NBT": 256,
        "@M8": 7,
        "@MT": 3,
        "@CT": 2,
        "@PF": 0
    },

    "MS255W": {
        "XXX": "256",
        "YYY": "255MS",
        "ZZZ": "MS255W",
        "@NB": 32,
        "@BASE": 24,
        "@NBT": 255,
        "@M8": 3,
        "@MT": 1,
        "@CT": 0,
        "@PF": 0
    },

    "MS255E": {
        "XXX": "256",
        "YYY": "255MS",
        "ZZZ": "MS255E",
        "@NB": 32,
        "@BASE": 24,
        "@NBT": 255,
        "@M8": 3,
        "@MT": 1,
        "@CT": 1,
        "@PF": 0
    },

    "MS255M": {
        "XXX": "256",
        "YYY": "255MS",
        "ZZZ": "MS255M",
        "@NB": 32,
        "@BASE": 24,
        "@NBT": 255,
        "@M8": 3,
        "@MT": 1,
        "@CT": 2,
        "@PF": 0
    },

    "MS256W": {
        "XXX": "256",
        "YYY": "256MS",
        "ZZZ": "MS256W",
        "@NB": 32,
        "@BASE": 24,
        "@NBT": 256,
        "@M8": 3,
        "@MT": 1,
        "@CT": 0,
        "@PF": 0
    },

    "MS256E": {
        "XXX": "256",
        "YYY": "256MS",
        "ZZZ": "MS256E",
        "@NB": 32,
        "@BASE": 24,
        "@NBT": 256,
        "@M8": 3,
        "@MT": 1,
        "@CT": 1,
        "@PF": 0
    },

    "MS256M": {
        "XXX": "256",
        "YYY": "256MS",
        "ZZZ": "MS256M",
        "@NB": 32,
        "@BASE": 24,
        "@NBT": 256,
        "@M8": 3,
        "@MT": 1,
        "@CT": 2,
        "@PF": 0
    },

    "BN254": {
        "XXX": "256",
        "YYY": "BN254",
        "ZZZ": "BN254",
        "@NB": 32,
        "@BASE": 24,
        "@NBT": 254,
        "@M8": 3,
        "@MT": 0,
        "@CT": 0,
        "@PF": 1
    },

    "BN254CX": {
        "XXX": "256",
        "YYY": "BN254CX",
        "ZZZ": "BN254CX",
        "@NB": 32,
        "@BASE": 24,
        "@NBT": 254,
        "@M8": 3,
        "@MT": 0,
        "@CT": 0,
        "@PF": 1
    },

    "BLS383": {
        "XXX": "384",
        "YYY": "BLS383",
        "ZZZ": "BLS383",
        "@NB": 48,
        "@BASE": 23,
        "@NBT": 383,
        "@M8": 3,
        "@MT": 0,
        "@CT": 0,
        "@PF": 2
    },
}

module.exports = CURVES;
