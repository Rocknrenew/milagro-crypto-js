/*
	Licensed to the Apache Software Foundation (ASF) under one
	or more contributor license agreements.  See the NOTICE file
	distributed with this work for additional information
	regarding copyright ownership.  The ASF licenses this file
	to you under the Apache License, Version 2.0 (the
	"License"); you may not use this file except in compliance
	with the License.  You may obtain a copy of the License at
	
	http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing,
	software distributed under the License is distributed on an
	"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
	KIND, either express or implied.  See the License for the
	specific language governing permissions and limitations
	under the License.
*/

/* Finite Field arithmetic */
/* AMCL mod p functions */

module.exports.FP = function(ctx) {

    /* General purpose Constructor */
    var FP = function(x) {
        if (x instanceof FP) {
            this.f = new ctx.BIG(x.f);
        } else {
            this.f = new ctx.BIG(x);
            this.nres();
        }
    };

    FP.NOT_SPECIAL = 0;
    FP.PSEUDO_MERSENNE = 1;
    FP.GENERALISED_MERSENNE = 2;
    FP.MONTGOMERY_FRIENDLY = 3;

    FP.MODBITS = ctx.config["@NBT"];
    FP.MOD8 = ctx.config["@M8"];
    FP.MODTYPE = ctx.config["@MT"];

    FP.FEXCESS = (1 << (ctx.BIG.BASEBITS * ctx.BIG.NLEN - FP.MODBITS - 1)); // 2^(BASEBITS*NLEN-MODBITS)
    FP.OMASK = (-1) << FP.TBITS;
    FP.TBITS = FP.MODBITS % ctx.BIG.BASEBITS;
    FP.TMASK = (1 << FP.TBITS) - 1;

    FP.prototype = {
        /* set this=0 */
        zero: function() {
            return this.f.zero();
        },

        /* copy from a ctx.BIG in ROM */
        rcopy: function(y) {
            this.f.rcopy(y);
            this.nres();
        },

        /* copy from another ctx.BIG */
        bcopy: function(y) {
            this.f.copy(y);
            this.nres();
            //alert("4. f= "+this.f.toString());
        },

        /* copy from another FP */
        copy: function(y) {
            return this.f.copy(y.f);
        },

        /* conditional swap of a and b depending on d */
        cswap: function(b, d) {
            this.f.cswap(b.f, d);
        },

        /* conditional copy of b to a depending on d */
        cmove: function(b, d) {
            this.f.cmove(b.f, d);
        },

        /* convert to Montgomery n-residue form */
        nres: function() {
            if (FP.MODTYPE != FP.PSEUDO_MERSENNE && FP.MODTYPE != FP.GENERALISED_MERSENNE) {
                var p = new ctx.BIG();
                p.rcopy(ctx.ROM_FIELD.Modulus);
                var d = new ctx.DBIG(0);

                d.hcopy(this.f);
                d.norm();
                d.shl(ctx.BIG.NLEN * ctx.BIG.BASEBITS);
                this.f.copy(d.mod(p));
            }
            return this;
        },

        /* convert back to regular form */
        redc: function() {
            var r = new ctx.BIG(0);
            r.copy(this.f);
            if (FP.MODTYPE != FP.PSEUDO_MERSENNE && FP.MODTYPE != FP.GENERALISED_MERSENNE) {
                var d = new ctx.DBIG(0);
                d.hcopy(this.f);
                var w = FP.mod(d);
                r.copy(w);
            }

            return r;
        },

        /* convert this to string */
        toString: function() {
            var s = this.redc().toString();
            return s;
        },

        /* test this=0 */
        iszilch: function() {
            this.reduce();
            return this.f.iszilch();
        },

        /* reduce this mod Modulus */
        reduce: function() {
            var p = new ctx.BIG(0);
            p.rcopy(ctx.ROM_FIELD.Modulus);
            return this.f.mod(p);
        },

        /* set this=1 */
        one: function() {
            this.f.one();
            return this.nres();
        },

        /* normalise this */
        norm: function() {
            return this.f.norm();
        },

        /* this*=b mod Modulus */
        mul: function(b) {
            var ea = FP.EXCESS(this.f);
            var eb = FP.EXCESS(b.f);

            if ((ea + 1) * (eb + 1) > FP.FEXCESS) this.reduce();

            var d = ctx.BIG.mul(this.f, b.f);
            this.f.copy(FP.mod(d));
            return this;
        },

        /* this*=c mod Modulus where c is an int */
        imul: function(c) {
            var s = false;
            this.norm();
            if (c < 0) {
                c = -c;
                s = true;
            }

            var afx = (FP.EXCESS(this.f) + 1) * (c + 1) + 1;
            if (c <= ctx.BIG.NEXCESS && afx < FP.FEXCESS) {
                this.f.imul(c);
                this.norm();
            } else {
                if (afx < FP.FEXCESS) this.f.pmul(c);
                else {
                    var p = new ctx.BIG(0);
                    p.rcopy(ctx.ROM_FIELD.Modulus);
                    var d = this.f.pxmul(c);
                    this.f.copy(d.mod(p));
                }
            }
            if (s) {
                this.neg();
                this.norm();
            }
            return this;
        },

        /* this*=this mod Modulus */
        sqr: function() {
            var d;
            //		this.norm();
            var ea = FP.EXCESS(this.f);

            if ((ea + 1) * (ea + 1) > FP.FEXCESS) this.reduce();
            //if ((ea+1)>= Math.floor((FP.FEXCESS-1)/(ea+1))) this.reduce();

            d = ctx.BIG.sqr(this.f);
            var t = FP.mod(d);
            this.f.copy(t);
            return this;
        },

        /* this+=b */
        add: function(b) {
            this.f.add(b.f);
            if (FP.EXCESS(this.f) + 2 >= FP.FEXCESS) this.reduce();
            return this;
        },
        /* this=-this mod Modulus */
        neg: function() {
            var sb, ov;
            var m = new ctx.BIG(0);
            m.rcopy(ctx.ROM_FIELD.Modulus);

            //		this.norm();
            sb = FP.logb2(FP.EXCESS(this.f) + 1);

            //		ov=FP.EXCESS(this.f); 
            //		sb=1; while(ov!==0) {sb++;ov>>=1;} 

            m.fshl(sb);
            this.f.rsub(m);
            if (FP.EXCESS(this.f) >= FP.FEXCESS) this.reduce();
            return this;
        },

        /* this-=b */
        sub: function(b) {
            var n = new FP(0);
            n.copy(b);
            n.neg();
            this.add(n);
            return this;
        },

        /* this/=2 mod Modulus */
        div2: function() {
            //		this.norm();
            if (this.f.parity() === 0)
                this.f.fshr(1);
            else {
                var p = new ctx.BIG(0);
                p.rcopy(ctx.ROM_FIELD.Modulus);

                this.f.add(p);
                this.f.norm();
                this.f.fshr(1);
            }
            return this;
        },

        /* this=1/this mod Modulus */
        inverse: function() {
            var p = new ctx.BIG(0);
            p.rcopy(ctx.ROM_FIELD.Modulus);
            var r = this.redc();
            r.invmodp(p);
            this.f.copy(r);
            return this.nres();
        },

        /* return TRUE if this==a */
        equals: function(a) {
            a.reduce();
            this.reduce();
            if (ctx.BIG.comp(a.f, this.f) === 0) return true;
            return false;
        },

        /* return this^e mod Modulus */
        pow: function(e) {
            var bt;
            var r = new FP(1);
            e.norm();
            this.norm();
            var m = new FP(0);
            m.copy(this);
            while (true) {
                bt = e.parity();
                e.fshr(1);
                if (bt == 1) r.mul(m);
                if (e.iszilch()) break;
                m.sqr();
            }

            r.reduce();
            return r;
        },

        /* return jacobi symbol (this/Modulus) */
        jacobi: function() {
            var p = new ctx.BIG(0);
            p.rcopy(ctx.ROM_FIELD.Modulus);
            var w = this.redc();
            return w.jacobi(p);
        },

        /* return sqrt(this) mod Modulus */
        sqrt: function() {
            this.reduce();
            var b = new ctx.BIG(0);
            b.rcopy(ctx.ROM_FIELD.Modulus);
            if (FP.MOD8 == 5) {
                b.dec(5);
                b.norm();
                b.shr(3);
                var i = new FP(0);
                i.copy(this);
                i.f.shl(1);
                var v = i.pow(b);
                i.mul(v);
                i.mul(v);
                i.f.dec(1);
                var r = new FP(0);
                r.copy(this);
                r.mul(v);
                r.mul(i);
                r.reduce();
                return r;
            } else {
                b.inc(1);
                b.norm();
                b.shr(2);
                return this.pow(b);
            }
        }

    };

    FP.logb2 = function(v) {
        v |= v >>> 1;
        v |= v >>> 2;
        v |= v >>> 4;
        v |= v >>> 8;
        v |= v >>> 16;

        v = v - ((v >>> 1) & 0x55555555);
        v = (v & 0x33333333) + ((v >>> 2) & 0x33333333);
        var r = ((v + (v >>> 4) & 0xF0F0F0F) * 0x1010101) >>> 24;
        return r + 1;
    };

    /* calculate Field Excess */
    FP.EXCESS = function(a) {
        return ((a.w[ctx.BIG.NLEN - 1] & FP.OMASK) >> (FP.MODBITS % ctx.BIG.BASEBITS)) + 1;
    };


    /* reduce a ctx.DBIG to a ctx.BIG using a "special" modulus */
    FP.mod = function(d) {
        var i, j, b = new ctx.BIG(0);
        if (FP.MODTYPE == FP.PSEUDO_MERSENNE) {
            var v, tw;
            var t = d.split(FP.MODBITS);
            b.hcopy(d);

            if (ctx.ROM_FIELD.MConst != 1)
                v = t.pmul(ctx.ROM_FIELD.MConst);
            else v = 0;

            t.add(b);
            t.norm();

            tw = t.w[ctx.BIG.NLEN - 1];
            t.w[ctx.BIG.NLEN - 1] &= FP.TMASK;
            t.inc(ctx.ROM_FIELD.MConst * ((tw >> FP.TBITS) + (v << (ctx.BIG.BASEBITS - FP.TBITS))));
            //		b.add(t);
            t.norm();
            return t;
        }

        if (FP.MODTYPE == FP.MONTGOMERY_FRIENDLY) {
            for (i = 0; i < ctx.BIG.NLEN; i++)
                d.w[ctx.BIG.NLEN + i] += d.muladd(d.w[i], ctx.ROM_FIELD.MConst - 1, d.w[i], ctx.BIG.NLEN + i - 1);
            for (i = 0; i < ctx.BIG.NLEN; i++)
                b.w[i] = d.w[ctx.BIG.NLEN + i];
        }

        if (FP.MODTYPE == FP.GENERALISED_MERSENNE) { // GoldiLocks Only
            var t = d.split(FP.MODBITS);
            b.hcopy(d);
            b.add(t);
            var dd = new ctx.DBIG(0);
            dd.hcopy(t);
            dd.shl(FP.MODBITS / 2);

            var tt = dd.split(FP.MODBITS);
            var lo = new ctx.BIG();
            lo.hcopy(dd);

            b.add(tt);
            b.add(lo);
            //b.norm();
            tt.shl(FP.MODBITS / 2);
            b.add(tt);

            var carry = b.w[ctx.BIG.NLEN - 1] >> FP.TBITS;
            b.w[ctx.BIG.NLEN - 1] &= FP.TMASK;
            b.w[0] += carry;

            b.w[Math.floor(224 / ctx.BIG.BASEBITS)] += carry << (224 % ctx.BIG.BASEBITS);
        }

        if (FP.MODTYPE == FP.NOT_SPECIAL) {

            var m = new ctx.BIG(0);
            m.rcopy(ctx.ROM_FIELD.Modulus);

            b.copy(ctx.BIG.monty(m, ctx.ROM_FIELD.MConst, d));

        }
        b.norm();
        return b;
    };
    FP.ctx = ctx;
    return FP;
};