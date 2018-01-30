import {Component, OnInit} from '@angular/core';
import 'hammerjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as fileSaver from 'file-saver';
import {extensions_installer, extensions_core} from '../extension';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private url = '//raw.githubusercontent.com/wikimedia/mediawiki-extensions/master/.gitmodules';

  title = 'app';

  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  // typeOfExtensions: Extension[];

 protected extensions_installer = extensions_installer;
 protected extensions_core = extensions_core;

  constructor(private formBuilder: FormBuilder) {  }

  ngOnInit() {
    this.firstFormGroup = this.formBuilder.group({
      extension_installer: ['', Validators.required],
      extension_core: ['', Validators.required],
      extension_user: ['']
    });
    this.secondFormGroup = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    /*
    this.observableExtensions = this.httpService.getExtensions();
    this.observableExtensions.subscribe(
      typeOfExtensions => this.typeOfExtensions = typeOfExtensions);
    */
  }

  private submit(): void {
    const user = '{ "username": "' + this.secondFormGroup.value.username + '", "password": "' + this.secondFormGroup.value.password + '" }';
    let file = '';

    for (const i of this.firstFormGroup.value.extension_installer) {
      file += '\n{\n "name" : "' + i + '",\n "url" : "https://gerrit.wikimedia.org/r/p/mediawiki/extensions/' + i + '.git",\n "help" : "https://www.mediawiki.org/wiki/Extension:' + i + '"\n },';
    }

    for (const i of this.firstFormGroup.value.extension_core) {
      file += '\n{\n "name" : "' + i + '",\n "url" : "https://gerrit.wikimedia.org/r/p/mediawiki/extensions/' + i + '.git",\n "help" : "https://www.mediawiki.org/wiki/Extension:' + i + '"\n },';
    }

    const allFile = '{\n "extensions" : [' + file.substring(0, file.length - 1) + '\n]\n}';

    this.save(user, 'user');
    this.save(allFile, 'extensions');
  }

  private save(toSave, filename): void {
    const file = new File([toSave], filename + '.json', {type: 'text/plain;charset=utf-8'});
    fileSaver.saveAs(file);
  }
}
