package com.hackathon.xpgame.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hackathon.xpgame.dto.UsbAccessRequest;
import com.hackathon.xpgame.dto.UsbAccessResponse;
import com.hackathon.xpgame.service.UsbAccessService;

@RestController
@RequestMapping("/api/usb")
public class UsbController {

    @Autowired
    private UsbAccessService usbAccessService;

    @PostMapping("/attempt")
    public UsbAccessResponse attempt(@RequestBody UsbAccessRequest request) {
        return usbAccessService.attempt(request.getSessionId(), request.getPassword());
    }
}
