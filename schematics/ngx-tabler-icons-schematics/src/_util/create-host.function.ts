import { virtualFs, workspaces } from "@angular-devkit/core";
import { SchematicsException, Tree } from "@angular-devkit/schematics";

export function createHost(tree: Tree): workspaces.WorkspaceHost{

  const host: workspaces.WorkspaceHost = {
    readFile: async (path: string) => readFileAsync(tree, path),
    writeFile: async (path: string, data: string) => writeFileAsync(tree, path, data),
    isDirectory: async (path: string) => isDirectoryAsync(tree, path),
    isFile: async(path: string) => isFileAsync(tree, path)
  };

  return host;
}

async function readFileAsync(tree: Tree, path: string): Promise<string> {
  const data = tree.read(path);
  
  if(!data){
    throw new SchematicsException("File not found");
  }

  return virtualFs.fileBufferToString(data);
}

async function writeFileAsync(tree: Tree, path: string, data: string): Promise<void> {
  return tree.overwrite(path, data);
}

async function isDirectoryAsync(tree: Tree, path: string): Promise<boolean> {
  return !tree.exists(path) && tree.getDir(path).subfiles.length > 0;
}

async function isFileAsync(tree: Tree, path: string): Promise<boolean> {
  return tree.exists(path);
}