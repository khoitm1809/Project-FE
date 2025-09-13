/* eslint-disable no-case-declarations */
import { t } from "i18next"

export const getMessageFromCode = (res) => {

    switch (res.status) {
        case 401:
            return t("error.401")
        case 502:
            return t("error.502")
        default:
            return res?.data?.errorMessage;
    }

}