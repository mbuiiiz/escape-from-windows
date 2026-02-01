package com.hackathon.xpgame.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hackathon.xpgame.dto.ActionRequest;
import com.hackathon.xpgame.dto.ActionResponse;
import com.hackathon.xpgame.service.ActionService;

@RestController
@RequestMapping("/api/actions")
public class ActionController {

    @Autowired
    private ActionService actionService;

    @PostMapping
    public ActionResponse submitAction(@RequestBody ActionRequest request) {
        // TODO: Implement action processing

        String sessionId = request.getSessionId();
        String actionType = request.getActionType();
        Object Data = request.getData();

        boolean status = actionService.processAction(sessionId, actionType, Data);

        if(status) {
            switch(actionType) {
                case "OPEN" -> {
                    Object result = actionService.getActionResult(sessionId, actionType);
                    String message = "Action processed successfully";
                    return new ActionResponse(status, message, result);
                }
            }
        } 
        
        
        String message = "Failed to process action";
        return new ActionResponse(status, message, null);
    }    
}