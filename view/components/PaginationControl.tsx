import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button} from 'react-native-elements';

type PaginationControlProps = {
  page: number;
  limit: number;
  total?: number;
  apply: (page: number) => unknown;
};

export const PaginationControl: React.FC<PaginationControlProps> = ({
  page,
  limit,
  total,
  apply,
}) => {
  const maxRenderedLinks = 4; // todo test on screen size
  const startPage = page > 3 ? page - 2 : 1;
  const pageNumArray = new Array(maxRenderedLinks)
    .fill(startPage)
    .map((pageNum, i) => pageNum + i);

  const hasNext: boolean = !!(total && page * limit + limit <= total);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.buttonContainerPrev}>
        {page > 1 && (
          <Button title={'Previous'} onPress={() => apply(page - 1)} />
        )}
      </View>
      <View style={styles.linksContainer}>
        {total &&
          pageNumArray
            .filter(pageNum => pageNum <= total / limit)
            .map(pageNum => (
              <Button
                containerStyle={styles.linkButtonContainer}
                buttonStyle={styles.linkButton}
                disabledStyle={styles.linkButtonDisabled}
                disabled={pageNum === page}
                key={pageNum}
                title={pageNum.toString()}
                onPress={() => apply(pageNum)}
              />
            ))}
      </View>
      <View style={styles.buttonContainerNext}>
        {hasNext && <Button title={'Next'} onPress={() => apply(page + 1)} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    marginHorizontal: 15,
    flexDirection: 'row',
    alignContent: 'space-between',
    alignItems: 'center',
  },
  linksContainer: {
    width: '60%',
    flexDirection: 'row',
  },
  buttonContainerNext: {
    width: 80,
  },
  buttonContainerPrev: {
    width: 80,
  },
  linkButtonContainer: {
    alignSelf: 'center',
    borderRadius: 10,
    width: 40,
    marginHorizontal: 5,
  },
  linkButton: {},
  linkButtonDisabled: {},
});
