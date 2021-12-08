import React, { useState } from "react"
import { navigate } from "gatsby"
import { useToasts } from "react-toast-notifications"

import PageMetadata from "../components/PageMetadata"
import {
  PageBody,
  Form,
  Label,
  Input,
  TextArea,
  Button,
  FormHeader,
  RadioPrompt,
  RadioContainer,
  RadioLabel,
  RadioInputContainer,
  Required,
} from "../components/SharedStyledComponents"

const bankRequiredFields = [
  "beneficiaryName",
  "contactEmail",
  "beneficiaryAddress",
  "fiatCurrencySymbol",
  "bankName",
  "bankAddress",
  "bankAccountNumber",
  "bankRoutingNumber",
  "granteeSecurityID",
]

const intlBankRequiredFields = [
  "beneficiaryName",
  "contactEmail",
  "beneficiaryAddress",
  "fiatCurrencySymbol",
  "bankName",
  "bankAddress",
  "bankAccountNumber",
  "bankSWIFT",
  "granteeSecurityID",
]

const ethRequiredFields = [
  "beneficiaryName",
  "contactEmail",
  "ethAddress",
  "granteeSecurityID",
]
const daiRequiredFields = [
  "beneficiaryName",
  "contactEmail",
  "daiAddress",
  "granteeSecurityID",
]

const ExplorePage = () => {
  const [formState, setFormState] = useState({
    ethOrFiat: "",
    beneficiaryName: "",
    contactEmail: "",
    beneficiaryAddress: "",
    fiatCurrencySymbol: "",
    bankName: "",
    bankAddress: "",
    bankAccountNumber: "", // IBAN is used to identify an individual account involved in the international transaction
    bankRoutingNumber: "",
    bankSWIFT: "", // SWIFT code is used to identify a specific bank during an international transaction
    notes: "",
    ethOrDai: "",
    ethAddress: "",
    daiAddress: "",
    granteeSecurityID: "",
  })

  const { addToast } = useToasts()

  const handleInputChange = event => {
    const target = event.target
    let value = target.value
    const name = target.name
    if (name === "fiatCurrencySymbol") {
      value = value.toLocaleUpperCase()
    }
    setFormState({ ...formState, [name]: value })
  }

  const submitInquiry = () => {
    fetch("/.netlify/functions/grantee", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formState),
    })
      .then(response => {
        if (response.status !== 200) {
          addToast("Error submitting, please try again.", {
            appearance: "error",
            autoDismiss: true,
          })
        } else {
          addToast("Success!", {
            appearance: "success",
            autoDismiss: true,
          })
          navigate("/en/thanks/")
        }
      })
      .catch(error => {
        console.error(error)
        addToast("Error submitting, please try again.", {
          appearance: "error",
          autoDismiss: true,
        })
      })
  }

  const handleSubmit = event => {
    event.preventDefault()
    submitInquiry()
  }

  const isFormValid = () => {
    let isValid = false

    const fieldGroups = [
      bankRequiredFields,
      intlBankRequiredFields,
      ethRequiredFields,
      daiRequiredFields,
    ]

    fieldGroups.forEach(fieldGroup => {
      let isGroupValid = true

      fieldGroup.forEach(field => {
        if (!formState[field]) {
          isGroupValid = false
        }
      })
      if (isGroupValid) {
        isValid = true
      }
    })

    return isValid
  }

  const isValid = isFormValid()

  return (
    <>
      <PageMetadata
        title="Grantee Form"
        meta={[
          {
            name: "robots",
            content: "noindex",
          },
        ]}
      />
      <PageBody>
        <FormHeader>
          <h1>Grantee Payment Form</h1>
          <p>
            Please submit your bank or wallet details using this secure form.
            The Ethereum Foundation can remit payment in DAI, ETH, or the fiat
            currency of your choosing.
          </p>
          <p>
            <strong>If you choose to be paid in any fiat currency</strong>, the payment will be sent from our account on the following Monday and should arrive in your account in roughly 10 business days. Please note this will be an international wire transfer, so please provide international banking details.
          </p>
          <p>
            <strong>If you choose to be paid in ETH or DAI</strong>, someone
            from the Ethereum Foundation will contact you via email to confirm
            your address with a test amount before sending the entirety of the
            funds.
          </p>
        </FormHeader>
        <Form onSubmit={handleSubmit}>
          <RadioContainer>
            <RadioPrompt>
              Payment preference <Required>*</Required>
            </RadioPrompt>
            <RadioInputContainer>
              <RadioLabel>
                <Input
                  type="radio"
                  name="ethOrFiat"
                  value="eth"
                  onChange={handleInputChange}
                />
                <div>Receive ETH/DAI</div>
              </RadioLabel>
            </RadioInputContainer>
            <RadioInputContainer>
              <RadioLabel>
                <Input
                  type="radio"
                  name="ethOrFiat"
                  value="fiat"
                  onChange={handleInputChange}
                />
                <div>Receive Fiat</div>
              </RadioLabel>
            </RadioInputContainer>
          </RadioContainer>

          {formState.ethOrFiat && (
            <div>
              <Label>
                <span>
                  Beneficiary name <Required>*</Required>
                </span>
                <div>
                  <small>
                    Name of the individual or entity attached to the account
                    receiving the funds.
                  </small>
                </div>

                <Input
                  type="text"
                  maxLength="100"
                  name="beneficiaryName"
                  placeholder="John Smith, Glossy DeFi LLC"
                  value={formState.beneficiaryName}
                  onChange={handleInputChange}
                />
              </Label>

              <Label>
                <span>
                  Contact email <Required>*</Required>
                </span>
                <div>
                  <small>
                    This email address will receive a copy of the submission for
                    your records.
                  </small>
                </div>

                <Input
                  type="email"
                  name="contactEmail"
                  value={formState.contactEmail}
                  onChange={handleInputChange}
                />
              </Label>

              {formState.ethOrFiat === "fiat" && (
                <div>
                  <Label>
                    <span>
                      Beneficiary address <Required>*</Required>
                    </span>
                    <div>
                      <small>
                        Personal or business address of the individual or entity
                        receiving the funds.
                      </small>
                    </div>
                    <TextArea
                      name="beneficiaryAddress"
                      maxLength="255"
                      placeholder="1234 Apple Street Unit A New York, NY 10011 United States"
                      value={formState.beneficiaryAddress}
                      onChange={handleInputChange}
                    />
                  </Label>
                  <Label>
                    <span>
                      Fiat currency code <Required>*</Required>
                    </span>
                    <div>
                      <small>
                        Code of the currency you'd like to receive funds, e.g.
                        EUR, USD, RUB.
                      </small>
                    </div>

                    <Input
                      type="text"
                      maxLength="3"
                      name="fiatCurrencySymbol"
                      value={formState.fiatCurrencySymbol}
                      onChange={handleInputChange}
                    />
                  </Label>

                  <Label>
                    <span>
                      Bank name <Required>*</Required>
                    </span>
                    <div>
                      <small>Name of receiving bank.</small>
                    </div>

                    <Input
                      type="text"
                      maxLength="100"
                      name="bankName"
                      placeholder="JP Morgan Chase"
                      value={formState.bankName}
                      onChange={handleInputChange}
                    />
                  </Label>

                  <Label>
                    <span>
                      Bank address <Required>*</Required>
                    </span>
                    <div>
                      <small>Branch address of receiving bank.</small>
                    </div>
                    <TextArea
                      name="bankAddress"
                      maxLength="255"
                      placeholder="5678 Banana Street PO Box 35 New York, NY 10011 United States"
                      value={formState.bankAddress}
                      onChange={handleInputChange}
                    />
                  </Label>

                  <Label>
                    <span>
                      International Bank Account Number{" "}
                      <Required>*</Required>
                    </span>
                    <div>
                      <small>
                        Provide an International Bank Account Number (IBAN).
                      </small>
                    </div>

                    <Input
                      type="text"
                      maxLength="50"
                      name="bankAccountNumber"
                      value={formState.bankAccountNumber}
                      onChange={handleInputChange}
                    />
                  </Label>

                  <Label>
                    <span>Bank SWIFT code</span>
                    <div>
                      <small>
                        A SWIFT Code or Bank Identifier Code (BIC) is used to
                        specify a particular bank or branch. These codes are
                        used when transferring money between banks, particularly
                        for international wire transfers.
                      </small>
                    </div>

                    <Input
                      type="text"
                      maxLength="100"
                      name="bankSWIFT"
                      placeholder="ABCDUS00XXX"
                      value={formState.bankSWIFT}
                      onChange={handleInputChange}
                    />
                  </Label>
                </div>
              )}

              {formState.ethOrFiat === "eth" && (
                <div>
                  <RadioContainer>
                    <RadioPrompt>
                      Payment preference <Required>*</Required>
                    </RadioPrompt>
                    <RadioInputContainer>
                      <RadioLabel>
                        <Input
                          type="radio"
                          name="ethOrDai"
                          value="eth"
                          onChange={handleInputChange}
                        />
                        <div>Receive ETH</div>
                      </RadioLabel>
                    </RadioInputContainer>
                    <RadioInputContainer>
                      <RadioLabel>
                        <Input
                          type="radio"
                          name="ethOrDai"
                          value="dai"
                          onChange={handleInputChange}
                        />
                        <div>Receive DAI</div>
                      </RadioLabel>
                    </RadioInputContainer>
                  </RadioContainer>

                  {formState.ethOrDai === "eth" && (
                    <Label>
                      <span>ETH Address</span>
                      <div>
                        <small>
                          Ethereum address to receive ETH. Make sure it’s a
                          secured wallet that you control.
                        </small>
                      </div>

                      <Input
                        type="text"
                        maxLength="50"
                        name="ethAddress"
                        value={formState.ethAddress}
                        onChange={handleInputChange}
                      />
                    </Label>
                  )}

                  {formState.ethOrDai === "dai" && (
                    <Label>
                      <span>DAI Address</span>
                      <div>
                        <small>
                          Ethereum address to receive DAI. Make sure it’s a
                          secured wallet that you control.
                        </small>
                      </div>

                      <Input
                        type="text"
                        maxLength="50"
                        name="daiAddress"
                        value={formState.daiAddress}
                        onChange={handleInputChange}
                      />
                    </Label>
                  )}
                </div>
              )}

              <Label>
                <span>Notes</span>
                <div>
                  <small>Anything else we should know?</small>
                </div>
                <TextArea
                  name="notes"
                  value={formState.notes}
                  onChange={handleInputChange}
                />
              </Label>

              <Label>
                <span>
                  Grantee Security ID <Required>*</Required>
                </span>
                <div>
                  <small>The key phrase provided to you by ESP.</small>
                </div>

                <Input
                  type="text"
                  name="granteeSecurityID"
                  value={formState.granteeSecurityID}
                  onChange={handleInputChange}
                />
              </Label>

              <div>
                <Button disabled={!isValid} type="submit">
                  Submit
                </Button>
              </div>
            </div>
          )}
        </Form>
      </PageBody>
    </>
  )
}

export default ExplorePage
