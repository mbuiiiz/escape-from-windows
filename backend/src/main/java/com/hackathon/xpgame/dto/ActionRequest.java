<<<<<<< HEAD
// TODO: implement

=======
package com.hackathon.xpgame.dto;

public class ActionRequest {
    private String sessionId;
    private String actionType;
    private Object data;

    public ActionRequest() {
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getActionType() {
        return actionType;
    }

    public void setActionType(String actionType) {
        this.actionType = actionType;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }
}
>>>>>>> backend/rest
