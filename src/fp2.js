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

/* Finite Field arithmetic  Fp^2 functions */

/* FP2 elements are of the form a+ib, where i is sqrt(-1) */

module.exports.FP2 = function(ctx) {

    /* general purpose constructor */
    var FP2 = function(c, d) {
        if (c instanceof FP2) {
            this.a = new ctx.FP(c.a);
            this.b = new ctx.FP(c.b);
        } else {
            this.a = new ctx.FP(c);
            this.b = new ctx.FP(d);
        }
    };

    FP2.prototype = {
        /* reduce components mod Modulus */
        reduce: function() {
            this.a.reduce();
            this.b.reduce();
        },
        /* normalise components of w */
        norm: function() {
            this.a.norm();
            this.b.norm();
        },
        /* test this=0 ? */
        iszilch: function() {
            this.reduce();
            return (this.a.iszilch() && this.b.iszilch());
        },
        /* test this=1 ? */
        isunity: function() {
            var one = new ctx.FP(1);
            return (this.a.equals(one) && this.b.iszilch());
        },
        /* conditional copy of g to this depending on d */
        cmove: function(g, d) {
            this.a.cmove(g.a, d);
            this.b.cmove(g.b, d);
        },

        /* test this=x */
        equals: function(x) {
            return (this.a.equals(x.a) && this.b.equals(x.b));
        },
        /* extract a */
        getA: function() {
            return this.a.redc();
        },
        /* extract b */
        getB: function() {
            return this.b.redc();
        },

        /* set from pair of FPs */
        set: function(c, d) {
            this.a.copy(c);
            this.b.copy(d);
        },
        /* set a */
        seta: function(c) {
            this.a.copy(c);
            this.b.zero();
        },

        /* set from two BIGs */
        bset: function(c, d) {
            this.a.bcopy(c);
            this.b.bcopy(d);
        },

        /* set from one ctx.BIG */
        bseta: function(c) {
            this.a.bcopy(c);
            this.b.zero();
        },
        /* copy this=x */
        copy: function(x) {
            this.a.copy(x.a);
            this.b.copy(x.b);
        },
        /* set this=0 */
        zero: function() {
            this.a.zero();
            this.b.zero();
        },
        /* set this=1 */
        one: function() {
            this.a.one();
            this.b.zero();
        },
        /* negate this */
        neg: function() {
            //		this.norm();
            var m = new ctx.FP(this.a);
            var t = new ctx.FP(0);

            m.add(this.b);
            m.neg();
            //		m.norm();
            t.copy(m);
            t.add(this.b);
            this.b.copy(m);
            this.b.add(this.a);
            this.a.copy(t);
            //this.norm();
        },
        /* conjugate this */
        conj: function() {
            this.b.neg();
            this.b.norm();
        },
        /* this+=a */
        add: function(x) {
            this.a.add(x.a);
            this.b.add(x.b);
        },
        /* this-=x */
        sub: function(x) {
            var m = new FP2(x); //var m=new FP2(0); m.copy(x);
            m.neg();
            this.add(m);
        },
        /* this*=s, where s is FP */
        pmul: function(s) {
            this.a.mul(s);
            this.b.mul(s);
        },
        /* this*=c, where s is int */
        imul: function(c) {
            this.a.imul(c);
            this.b.imul(c);
        },
        /* this*=this */
        sqr: function() {
            //		this.norm();

            var w1 = new ctx.FP(this.a);
            var w3 = new ctx.FP(this.a);
            var mb = new ctx.FP(this.b);

            //		w3.mul(this.b);
            w1.add(this.b);


            w3.add(this.a);
            w3.norm();
            this.b.mul(w3);

            mb.neg();
            this.a.add(mb);

            this.a.norm();
            w1.norm();

            this.a.mul(w1);
            //		this.b.copy(w3); this.b.add(w3);
            //		this.b.norm();
        },
        /* this*=y */
        /* Now using Lazy reduction - inputs must be normed */
        mul: function(y) {
            var p = new ctx.BIG(0);
            p.rcopy(ctx.ROM_FIELD.Modulus);
            var pR = new ctx.DBIG(0);
            pR.ucopy(p);

            var exa = ctx.FP.EXCESS(this.a.f);
            var exb = ctx.FP.EXCESS(this.b.f);
            var eya = ctx.FP.EXCESS(y.a.f);
            var eyb = ctx.FP.EXCESS(y.b.f);

            var eC = exa + exb + 1;
            var eD = eya + eyb + 1;

            if ((eC + 1) * (eD + 1) > ctx.FP.FEXCESS) {
                if (eC > 0) this.a.reduce();
                if (eD > 0) this.b.reduce();
                //	if (eD>1) y.reduce();
            }

            var A = ctx.BIG.mul(this.a.f, y.a.f);
            var B = ctx.BIG.mul(this.b.f, y.b.f);

            var C = new ctx.BIG(this.a.f);
            var D = new ctx.BIG(y.a.f);

            C.add(this.b.f);
            C.norm();
            D.add(y.b.f);
            D.norm();

            var E = ctx.BIG.mul(C, D);
            var F = new ctx.DBIG(0);
            F.copy(A);
            F.add(B);
            B.rsub(pR);

            A.add(B);
            A.norm();
            E.sub(F);
            E.norm();

            this.a.f.copy(ctx.FP.mod(A));
            this.b.f.copy(ctx.FP.mod(E));


            /*

            		var w1=new ctx.FP(this.a); 
            		var w2=new ctx.FP(this.b); 
            		var w5=new ctx.FP(this.a); 
            		var mw=new ctx.FP(0);

            		w1.mul(y.a);  // w1=a*y.a  - this norms w1 and y.a, NOT a
            		w2.mul(y.b);  // w2=b*y.b  - this norms w2 and y.b, NOT b
            		w5.add(this.b);    // w5=a+b
            		this.b.copy(y.a); this.b.add(y.b); // b=y.a+y.b

            		this.b.norm();
            		w5.norm();

            		this.b.mul(w5);
            		mw.copy(w1); mw.add(w2); mw.neg();

            		this.b.add(mw); mw.add(w1);
            		this.a.copy(w1); this.a.add(mw);

            		this.norm(); */
        },

        /* sqrt(a+ib) = sqrt(a+sqrt(a*a-n*b*b)/2)+ib/(2*sqrt(a+sqrt(a*a-n*b*b)/2)) */
        /* returns true if this is QR */
        sqrt: function() {
            if (this.iszilch()) return true;
            var w1 = new ctx.FP(this.b);
            var w2 = new ctx.FP(this.a);

            w1.sqr();
            w2.sqr();
            w1.add(w2);
            if (w1.jacobi() != 1) {
                this.zero();
                return false;
            }
            w1 = w1.sqrt();
            w2.copy(this.a);
            w2.add(w1);
            w2.norm();
            w2.div2();
            if (w2.jacobi() != 1) {
                w2.copy(this.a);
                w2.sub(w1);
                w2.norm();
                w2.div2();
                if (w2.jacobi() != 1) {
                    this.zero();
                    return false;
                }
            }
            w2 = w2.sqrt();
            this.a.copy(w2);
            w2.add(w2);
            w2.inverse();
            this.b.mul(w2);
            return true;
        },

        /* convert this to hex string */
        toString: function() {
            return ("[" + this.a.toString() + "," + this.b.toString() + "]");
        },
        /* this=1/this */
        inverse: function() {
            this.norm();
            var w1 = new ctx.FP(this.a);
            var w2 = new ctx.FP(this.b);
            w1.sqr();
            w2.sqr();
            w1.add(w2);
            w1.inverse();
            this.a.mul(w1);
            w1.neg();
            w1.norm();
            this.b.mul(w1);
        },
        /* this/=2 */
        div2: function() {
            this.a.div2();
            this.b.div2();
        },
        /* this*=sqrt(-1) */
        times_i: function() {
            var z = new ctx.FP(this.a); //z.copy(this.a);
            this.a.copy(this.b);
            this.a.neg();
            this.b.copy(z);
        },

        /* w*=(1+sqrt(-1)) */
        /* where X*2-(1+sqrt(-1)) is irreducible for FP4, assumes p=3 mod 8 */
        mul_ip: function() {
            //		this.norm();
            var t = new FP2(this); // t.copy(this);
            var z = new ctx.FP(this.a); //z.copy(this.a);
            this.a.copy(this.b);
            this.a.neg();
            this.b.copy(z);
            this.add(t);
            //		this.norm();
        },

        /* w/=(1+sqrt(-1)) */
        div_ip: function() {
            var t = new FP2(0);
            this.norm();
            t.a.copy(this.a);
            t.a.add(this.b);
            t.b.copy(this.b);
            t.b.sub(this.a);
            this.copy(t);
            this.norm();
            this.div2();
        },
        /* this=this^e */
        pow: function(e) {
            var bt;
            var r = new FP2(1);
            this.norm();
            var x = new FP2(this); //x.copy(this);
            e.norm();
            while (true) {
                bt = e.parity();
                e.fshr(1);
                if (bt == 1) r.mul(x);
                if (e.iszilch()) break;
                x.sqr();
            }

            r.reduce();
            return r;
        }

    };

    FP2.ctx = ctx;
    return FP2;
};