import * as Docker from 'dockerode';
import {docker} from './docker-endpoint';
import vscode = require('vscode');


export interface ContainerItem extends vscode.QuickPickItem {
    containerDesc: Docker.ContainerDesc
}

function createItem(container: Docker.ContainerDesc) : ContainerItem {
    return <ContainerItem> {
        label: container.Image,
        containerDesc: container
    };
}

function computeItems(containers: Docker.ContainerDesc[], includeAll: boolean) : ContainerItem[] {
    const items : ContainerItem[] = [];

    for (let i = 0; i < containers.length; i++) {
        const item = createItem(containers[i]);
        items.push(item);
    }

    if (includeAll && containers.length > 0) {
        items.unshift(<ContainerItem> {
            label: 'All Containers' //,
            // description: 'Stops all running containers',
            // ids: allIds
        });
    }

    return items;
}

export async function quickPickContainer(includeAll: boolean = false) : Promise<ContainerItem>{
    const containers = await docker.getContainerDescriptors();

    if (!containers || containers.length == 0) {
        vscode.window.showInformationMessage('There are no running docker containers.');
        return;
    } else {
        const items: ContainerItem[] = computeItems(containers, includeAll);
        return vscode.window.showQuickPick(items, { placeHolder: 'Choose Container' });
    }
}