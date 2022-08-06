import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  Button,
  Chip,
  SearchBar,
  Overlay,
  CheckBox,
  Text,
} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Item, Order} from '../../types';
import {SortAndFilterSettings, SortSetting} from '../screens/CurrentList';

type FiltersParams = {
  applySettings: (settings: SortAndFilterSettings) => void;
  settings: SortAndFilterSettings;
  items: Item[];
};

type Tag = {
  name: string;
  checked: boolean;
};

export const Filters: React.FC<FiltersParams> = ({
  items,
  settings,
  applySettings,
}: FiltersParams) => {
  const [tagOverlayVisible, setTagOverlayVisible] = useState<boolean>(false);
  const [sortOverlayVisible, setSortOverlayVisible] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const allTagsRef = useRef<Tag[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [sortItems, setSortItems] = useState<SortSetting[]>([]);

  useEffect(() => {
    const tagsInput: string[] = Array.from(
      new Set(items.flatMap(item => item.tags)),
    );
    allTagsRef.current = tagsInput.map(name => ({
      name,
      checked:
        allTagsRef.current.find(tag => tag.name === name)?.checked ?? false,
    }));
    setAllTags(allTagsRef.current);
  }, [items]);

  const search = (text: string = '') => {
    setSearchText(text);
    applySettings({...settings, searchText: text});
  };

  const applyTagSettings = () => {
    const newTags = allTags
      .filter(({checked}) => checked)
      .map(({name}) => name);

    setTagOverlayVisible(false);
    applySettings({...settings, filterTags: newTags});
  };

  const applySortSettings = () => {
    applySettings({...settings, sort: sortItems});
    setSortOverlayVisible(false);
  };

  const toggleTag = (tag: Tag): void => {
    const newTags = allTags.map(tagRef => {
      if (tag.name === tagRef.name) {
        tag.checked = !tag.checked;
        return tag;
      }
      return tagRef;
    });
    setAllTags(newTags);
  };

  const removeTag = (tagName: string): void => {
    toggleTag({name: tagName, checked: true});
    applySettings({
      ...settings,
      filterTags: settings.filterTags.filter(tag => tag !== tagName),
    });
  };

  const displaySortOverlay = () => {
    setSortItems(settings.sort);
    setSortOverlayVisible(true);
  };

  const toggleSortItem = (key: string) => {
    const newSortItems = sortItems.map<SortSetting>(sortSetting => {
      sortSetting.selected = sortSetting.key === key;
      return sortSetting;
    });
    setSortItems(newSortItems);
  };

  const toggleSortOrder = (key: string) => {
    const newSortItems = sortItems.map<SortSetting>(sortSetting => {
      if (sortSetting.key === key) {
        const newOrder =
          sortSetting.order === Order.ASC ? Order.DESC : Order.ASC;
        sortSetting.order = newOrder;
      }
      return sortSetting;
    });
    setSortItems(newSortItems);
  };

  return (
    <View>
      <View style={styles.chipView}>
        <SearchBar
          value={searchText}
          onChangeText={search}
          placeholder="Search"
          containerStyle={styles.searchBar}
          inputContainerStyle={styles.searchInput}
          searchIcon={<Icon name="search" style={styles.searchIcon} />}
        />
        <View style={styles.editView}>
          <Button
            onPress={displaySortOverlay}
            containerStyle={styles.sortButton}
            icon={<Icon name="sort" size={20} style={styles.editIcon} />}
          />
        </View>
      </View>
      <View style={styles.chipView}>
        <Button
          containerStyle={styles.chip}
          onPress={() => setTagOverlayVisible(true)}
          title={''}
          icon={<Icon style={styles.editIcon} name="plus" size={20} />}
        />
        {settings.filterTags.map((tagName, i) => (
          <Chip
            key={i}
            containerStyle={styles.chip}
            title={tagName}
            onPress={() => removeTag(tagName)}
          />
        ))}
      </View>
      <Overlay
        isVisible={tagOverlayVisible}
        onBackdropPress={applyTagSettings}
        overlayStyle={styles.tagOverlay}>
        <ScrollView>
          {!allTags.length && <Text>There are not tags within this list</Text>}
          {allTags.map((tag, i) => (
            <CheckBox
              key={i}
              title={tag.name}
              checked={tag.checked}
              onPress={() => toggleTag(tag)}
              containerStyle={styles.tagCheckbox}
            />
          ))}
        </ScrollView>
      </Overlay>
      <Overlay
        isVisible={sortOverlayVisible}
        onBackdropPress={applySortSettings}
        overlayStyle={styles.tagOverlay}>
        <View>
          <Text style={styles.sortSettingsTitle}>Sort settings</Text>
          {sortItems.map(({key, order, selected}) => (
            <View style={styles.sortSettingItem} key={key}>
              <Text style={styles.sortItemLabel}>{translateSortKey(key)}</Text>
              <Button
                containerStyle={styles.sortSettingButton}
                disabledStyle={styles.sortSettingButtonDisabled}
                type={'outline'}
                disabled={!selected}
                onPress={() => toggleSortOrder(key)}
                icon={
                  <Icon
                    style={styles.editIcon}
                    size={25}
                    name={order === Order.ASC ? 'sort-up' : 'sort-down'}
                  />
                }
              />
              <Button
                containerStyle={styles.sortSettingButton}
                type={'outline'}
                onPress={() => toggleSortItem(key)}
                icon={
                  <Icon
                    style={styles.editIcon}
                    size={25}
                    name={selected ? 'toggle-on' : 'toggle-off'}
                  />
                }
              />
            </View>
          ))}
        </View>
      </Overlay>
    </View>
  );
};

const styles = StyleSheet.create({
  tagsView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tagOverlay: {
    backgroundColor: '#3d3d3d',
    height: '80%',
    width: '70%',
  },
  tagCheckbox: {
    backgroundColor: '#383838',
  },
  searchIcon: {
    color: '#fff',
    marginLeft: 3,
  },
  searchBar: {
    backgroundColor: '#3d3d3d',
    width: '88%',
    marginTop: 5,
    marginBottom: 10,
    paddingBottom: 2,
    borderBottomWidth: 0,
  },
  sortButton: {
    width: 40,
    borderRadius: 20,
  },
  searchInput: {
    borderRadius: 10,
  },
  chipView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  chip: {
    maxWidth: 150,
    margin: 3,
    borderRadius: 20,
  },
  editView: {
    width: 45,
    alignSelf: 'center',
  },
  editIcon: {
    color: '#fff',
  },
  sortSettingItem: {
    marginVertical: 9,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 50,
  },
  sortSettingsTitle: {
    alignSelf: 'center',
    fontSize: 20,
    marginBottom: 15,
  },
  sortItemLabel: {
    fontSize: 17,
    marginHorizontal: 10,
    width: '50%',
  },
  sortSettingButton: {
    marginHorizontal: 15,
  },
  sortSettingButtonDisabled: {
    backgroundColor: '#636363',
  },
});

function translateSortKey(key: keyof Item): string {
  switch (key) {
    case 'name':
      return 'Name';
    case 'currentAmount':
      return 'Current amount';
    case 'totalAmount':
      return 'Total (max) amount';
    case 'bought':
      return 'Is bought';
    case 'description':
      return 'Description';
    default:
      return key;
  }
}
