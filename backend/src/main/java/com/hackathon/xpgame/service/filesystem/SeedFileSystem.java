package com.hackathon.xpgame.service.filesystem;

import com.hackathon.xpgame.model.VirtualFile;
import com.hackathon.xpgame.model.VirtualFolder;
import org.springframework.stereotype.Component;

@Component
public class SeedFileSystem {

    public VirtualFolder createFileSystem() {
        VirtualFolder root = new VirtualFolder("C:");

        // TODO: Seed the file system with initial files and folders
        seedDesktop(root);
        seedDocuments(root);
        seedSystem(root);

        return root;
    }

    private void seedDesktop(VirtualFolder root) {
        VirtualFolder desktop = new VirtualFolder("Desktop");

        VirtualFile readme = new VirtualFile();
        readme.setName("README.txt");
        readme.setContent("Welcome to the XP Game!");
        desktop.addFile(readme);

        root.addSubfolder(desktop);
    }

    private void seedDocuments(VirtualFolder root) {
        VirtualFolder documents = new VirtualFolder("My Documents");
        // TODO: Add document files
        root.addSubfolder(documents);
    }

    private void seedSystem(VirtualFolder root) {
        VirtualFolder system = new VirtualFolder("System32");
        system.setHidden(true);
        // TODO: Add system files with clues
        root.addSubfolder(system);
    }
}