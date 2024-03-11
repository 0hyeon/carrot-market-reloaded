import FormButton from "@/components/form-btn";
import FormInput from "@/components/form-input";
import SocialLogin from "@/components/social-login";
import React from "react";

export default function CreateAccount() {
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Fill in th form below to join!</h2>
      </div>
      <form className="flex flex-col gap-3">
        <FormInput
          name="text"
          type="text"
          placeholder="Username"
          required
          errrors={[]}
        />
        <FormInput
          name="email"
          type="email"
          placeholder="Email"
          required
          errrors={[]}
        />
        <FormInput
          name="passwrod"
          type="password"
          placeholder="Password"
          required
          errrors={[]}
        />
        <FormInput
          name="password"
          type="password"
          placeholder="Confirm Password"
          required
          errrors={[]}
        />
        <FormButton loading={true} text="Create account" />
      </form>
      <SocialLogin />
    </div>
  );
}
