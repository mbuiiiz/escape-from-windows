<<<<<<< HEAD
// TODO: implement

=======
package com.hackathon.xpgame.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class VirtualFolder {
    private String name;
    private List<VirtualFile> files;
    private List<VirtualFolder> subfolders;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;
    private boolean isHidden;

    public VirtualFolder() {
        this.files = new ArrayList<>();
        this.subfolders = new ArrayList<>();
        this.createdAt = LocalDateTime.now();
        this.modifiedAt = LocalDateTime.now();
    }

    public VirtualFolder(String name) {
        this();
        this.name = name;
    }

    // TODO: Add getters and setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<VirtualFile> getFiles() {
        return files;
    }

    public void setFiles(List<VirtualFile> files) {
        this.files = files;
    }

    public List<VirtualFolder> getSubfolders() {
        return subfolders;
    }

    public void setSubfolders(List<VirtualFolder> subfolders) {
        this.subfolders = subfolders;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getModifiedAt() {
        return modifiedAt;
    }

    public void setModifiedAt(LocalDateTime modifiedAt) {
        this.modifiedAt = modifiedAt;
    }

    public boolean isHidden() {
        return isHidden;
    }

    public void setHidden(boolean hidden) {
        isHidden = hidden;
    }

    public void addFile(VirtualFile file) {
        this.files.add(file);
        this.modifiedAt = LocalDateTime.now();
    }

    public void addSubfolder(VirtualFolder folder) {
        this.subfolders.add(folder);
        this.modifiedAt = LocalDateTime.now();
    }
}
>>>>>>> backend/rest
