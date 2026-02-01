<<<<<<< HEAD
// TODO: implement

=======
package com.hackathon.xpgame.dto;

public class ActionResponse {
    private boolean status;
    private String message;
    private Object data;

    public ActionResponse() {
    }

    public ActionResponse(boolean status, String message, Object data)
    {
        this.status = status;
        this.message = message;
        this.data = data;
    }

    public boolean isSuccess() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }
}
>>>>>>> backend/rest
