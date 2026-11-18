package org.example.FutureService.exception;

import java.util.Objects;

public class BusinessException extends RuntimeException {

    private final int errorCode;
    private final String errorMessage;
    private final String errorDetail;
    private final Object errorData;

    public BusinessException(int errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
        this.errorMessage = message;
        this.errorDetail = message;
        this.errorData = null;
    }

    public BusinessException(int errorCode, String message, String detail) {
        super(message);
        this.errorCode = errorCode;
        this.errorMessage = message;
        this.errorDetail = detail;
        this.errorData = null;
    }

    public BusinessException(int errorCode, String message, Object data) {
        super(message);
        this.errorCode = errorCode;
        this.errorMessage = message;

        if (data instanceof String) {
            this.errorDetail = (String) data;
            this.errorData = null;
        } else {
            this.errorDetail = data != null ? data.toString() : null;
            this.errorData = data;
        }
    }

    public int getErrorCode() {
        return errorCode;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public String getErrorDetail() {
        return errorDetail;
    }

    public Object getErrorData() {
        return errorData;
    }

    public boolean hasStructuredErrorData() {
        return errorData != null && !(errorData instanceof String);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        BusinessException that = (BusinessException) o;
        return errorCode == that.errorCode &&
               Objects.equals(errorMessage, that.errorMessage) &&
               Objects.equals(errorDetail, that.errorDetail);
    }

    @Override
    public int hashCode() {
        return Objects.hash(errorCode, errorMessage, errorDetail);
    }

    @Override
    public String toString() {
        return "BusinessException{" +
                "errorCode=" + errorCode +
                ", errorMessage='" + errorMessage + '\'' +
                ", errorDetail='" + errorDetail + '\'' +
                ", hasStructuredData=" + hasStructuredErrorData() +
                '}';
    }
}
