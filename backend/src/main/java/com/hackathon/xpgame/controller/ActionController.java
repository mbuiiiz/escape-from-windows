package com.hackathon.xpgame.controller;

import com.hackathon.xpgame.dto.ActionRequest;
import com.hackathon.xpgame.dto.ActionResponse;
import com.hackathon.xpgame.service.ActionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/actions")
public class ActionController {

    @Autowired
    private ActionService actionService;

    @PostMapping
    public ActionResponse submitAction(@RequestBody ActionRequest request) {
        // TODO: Implement action processing
        return new ActionResponse();
    }
}