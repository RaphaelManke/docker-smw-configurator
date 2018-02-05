import {Component, OnInit} from '@angular/core';
import 'hammerjs';
import {Form, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import * as fileSaver from 'file-saver';
import {extensions_installer, extensions_core, extensions_smw, skins, User} from '../data';
import * as JSZip from 'jszip';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private url = '//raw.githubusercontent.com/wikimedia/mediawiki-extensions/master/.gitmodules';

  private visible = false;
  private env = 'DATABASE_NAME=my_wiki _2\nDATABASE_USER=wikiuser\nDATABASE_PASSWORD=example-password';
  private extensions_file = '';

  title = 'app';

  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;


 protected extensions_installer = extensions_installer;
 protected extensions_core = extensions_core;
 protected extensions_smw = extensions_smw;
 protected skins = skins;

  constructor(private formBuilder: FormBuilder) {  }

  ngOnInit() {
    this.firstFormGroup = this.formBuilder.group({
      extension_installer: [''],
      extension_core: [''],
      extension_user: ['']
    });
    this.secondFormGroup = this.formBuilder.group({
      extension_smw: [''],
      extension_user_smw: ['']
    });
    this.thirdFormGroup = this.formBuilder.group({
      skin: ['', [Validators.required, Validators.maxLength(1)]]
    });
    this.fourthFormGroup = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required]],
      username_database: [''],
      password_database: ['']
    });
  }

  private changeVisible(): void {
    this.visible = !this.visible;
  }

  private submit(): void {
    let database = '';
    const user = '\nSMW_ADMIN_USER=' + this.fourthFormGroup.value.username + '\nSMW_ADMIN_PASSWORD=' + this.fourthFormGroup.value.password;
    let zip = new JSZip();

    if (this.fourthFormGroup.value.username_database === '' || this.fourthFormGroup.value.password_database === '') {
      database = '\nSMW_DATABASE_USER=' + this.generateDatabase() + '\nSMW_DATABASE_PASSWORD=' + this.generateDatabase();
    } else {
      database = '\nSMW_DATABASE_USER=' + this.fourthFormGroup.value.username_database + '\nSMW_DATABASE_PASSWORD=' + this.fourthFormGroup.value.password_database;
    }
    this.env += user + database + '\nSMW_INSTANCE_NAME=Example Semantic Media Wiki build for the KIT\nSMW_LANGUAGE=de';

    this.submitHelper(this.firstFormGroup.value.extension_installer);
    this.submitHelper(this.firstFormGroup.value.extension_core);
    this.submitHelper(this.firstFormGroup.value.extension_user.split(','));
    this.submitHelper(this.secondFormGroup.value.extension_smw);
    this.submitHelper(this.secondFormGroup.value.extension_user_smw.split(','));

    const skin = '"skins" : [\n { \n "name" : "' + this.thirdFormGroup.value.skin + '",' +
      '\n "url" : "https://github.com/wikimedia/mediawiki-skins-' + this.thirdFormGroup.value.skin + '",' +
      '\n "help" : "https://www.mediawiki.org/wiki/Skin:' + this.thirdFormGroup.value.skin + '"\n}\n]';

    const all_extensions = '{\n "extensions" : [' + this.extensions_file.substring(0, this.extensions_file.length - 1) + '\n],\n' + skin + '\n}';

    zip.file('extension.json', all_extensions);
    zip.file('.env', this.env);
    zip.generateAsync({type: 'blob'})
      .then(function (content) {
        fileSaver.saveAs(content, 'smw_confinguration.zip');
      });
  }

  private submitHelper(extensions: string []): void {
    let result = '';

    for (let i of extensions) {
      i = i.trim();
      i = i.replace(/ +/g, '');

      if (i.length > 0) {
        result += '\n{\n "name" : "' + i + '",\n "url" : "https://gerrit.wikimedia.org/r/p/mediawiki/extensions/' + i + '.git",\n "help" : "https://www.mediawiki.org/wiki/Extension:' + i + '"\n },';
      }
    }
    this.extensions_file += result;
  }

  private generateDatabase(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+<>ABCDEFGHIJKLMNOP1234567890';
    const length = 15;
    let result = '';

    for (let x = 0; x < length; x++) {
      let i = Math.floor(Math.random() * chars.length);
      result += chars.charAt(i);
    }
    return result;
  }
}
