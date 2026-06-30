"use client";

import { useState } from "react";
import { Calculator, DollarSign, Home, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatPrice } from "@/lib/utils";

export default function CalculatorsPage() {
  const [tab, setTab] = useState<"affordability" | "mortgage" | "commute">("affordability");

  // Affordability
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState("");
  const affordableRent = income ? Number(income) * 0.3 - Number(expenses || 0) : 0;

  // Mortgage
  const [homePrice, setHomePrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [interestRate, setInterestRate] = useState("6.5");
  const [loanTerm, setLoanTerm] = useState("30");
  const loan = Number(homePrice) - Number(downPayment);
  const monthlyRate = Number(interestRate) / 100 / 12;
  const numPayments = Number(loanTerm) * 12;
  const monthlyPayment =
    loan > 0 && monthlyRate > 0
      ? (loan * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
        (Math.pow(1 + monthlyRate, numPayments) - 1)
      : 0;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-[1280px] mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Financial Tools
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Property Calculators</h1>
          <p className="text-xl text-gray-500 max-w-lg mx-auto">
            Plan your rental budget with our free financial tools.
          </p>
        </div>

        <div className="flex justify-center gap-3 mb-10">
          {[
            { key: "affordability", label: "Affordability", icon: Home },
            { key: "mortgage", label: "Mortgage", icon: Calculator },
            { key: "commute", label: "Cost of Living", icon: TrendingUp },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key as typeof tab)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all ${
                tab === key
                  ? "bg-green-600 text-white shadow-lg shadow-green-200"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-green-300"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        <div className="max-w-2xl mx-auto">
          {tab === "affordability" && (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Rental Affordability Calculator</h2>
              <p className="text-gray-500 mb-6 text-sm">
                Based on the common rule: spend no more than 30% of gross income on rent.
              </p>
              <div className="space-y-4">
                <Input
                  label="Monthly Gross Income ($)"
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  placeholder="e.g. 5000"
                  icon={<DollarSign className="w-4 h-4" />}
                />
                <Input
                  label="Monthly Fixed Expenses ($)"
                  type="number"
                  value={expenses}
                  onChange={(e) => setExpenses(e.target.value)}
                  placeholder="e.g. 500"
                  icon={<DollarSign className="w-4 h-4" />}
                />
                {income && (
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
                    <p className="text-sm text-green-700 font-medium mb-1">Recommended Max Rent</p>
                    <p className="text-4xl font-bold text-green-600">{formatPrice(Math.max(0, affordableRent))}</p>
                    <p className="text-xs text-green-600 mt-1">per month</p>
                    <div className="mt-4 pt-4 border-t border-green-200 grid grid-cols-2 gap-4 text-sm text-green-700">
                      <div>
                        <p className="font-semibold">{formatPrice(Number(income) * 0.3)}</p>
                        <p className="text-xs text-green-600">30% of income</p>
                      </div>
                      <div>
                        <p className="font-semibold">{formatPrice(Number(expenses))}</p>
                        <p className="text-xs text-green-600">fixed expenses</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === "mortgage" && (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Mortgage Calculator</h2>
              <p className="text-gray-500 mb-6 text-sm">
                Estimate your monthly mortgage payment.
              </p>
              <div className="space-y-4">
                <Input
                  label="Home Price ($)"
                  type="number"
                  value={homePrice}
                  onChange={(e) => setHomePrice(e.target.value)}
                  placeholder="e.g. 350000"
                  icon={<DollarSign className="w-4 h-4" />}
                />
                <Input
                  label="Down Payment ($)"
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(e.target.value)}
                  placeholder="e.g. 70000"
                  icon={<DollarSign className="w-4 h-4" />}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Interest Rate (%)"
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    step="0.1"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Loan Term</label>
                    <select
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none"
                    >
                      <option value="10">10 years</option>
                      <option value="15">15 years</option>
                      <option value="20">20 years</option>
                      <option value="30">30 years</option>
                    </select>
                  </div>
                </div>
                {monthlyPayment > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
                    <p className="text-sm text-green-700 font-medium mb-1">Monthly Payment</p>
                    <p className="text-4xl font-bold text-green-600">{formatPrice(monthlyPayment)}</p>
                    <p className="text-xs text-green-600 mt-1">principal + interest</p>
                    <div className="mt-4 pt-4 border-t border-green-200 grid grid-cols-3 gap-4 text-sm text-green-700">
                      <div>
                        <p className="font-semibold">{formatPrice(loan)}</p>
                        <p className="text-xs text-green-600">loan amount</p>
                      </div>
                      <div>
                        <p className="font-semibold">{formatPrice(monthlyPayment * numPayments)}</p>
                        <p className="text-xs text-green-600">total payment</p>
                      </div>
                      <div>
                        <p className="font-semibold">{formatPrice(monthlyPayment * numPayments - loan)}</p>
                        <p className="text-xs text-green-600">total interest</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === "commute" && (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Cost of Living Estimator</h2>
              <p className="text-gray-500 mb-6 text-sm">
                Estimate your total monthly housing costs.
              </p>
              <div className="space-y-4">
                {[
                  { label: "Monthly Rent", placeholder: "2500" },
                  { label: "Utilities (avg)", placeholder: "150" },
                  { label: "Renter's Insurance", placeholder: "30" },
                  { label: "Parking", placeholder: "100" },
                  { label: "Internet", placeholder: "60" },
                  { label: "Other Monthly Costs", placeholder: "200" },
                ].map(({ label, placeholder }) => {
                  const [val, setVal] = useState("");
                  return (
                    <div key={label} className="flex items-center gap-3">
                      <div className="flex-1">
                        <Input
                          label={label}
                          type="number"
                          value={val}
                          onChange={(e) => setVal(e.target.value)}
                          placeholder={placeholder}
                          icon={<DollarSign className="w-4 h-4" />}
                        />
                      </div>
                    </div>
                  );
                })}
                <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
                  <p className="text-sm text-green-700 font-medium">
                    Enter your costs above to see your total monthly estimate
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
